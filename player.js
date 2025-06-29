const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const musicPlayer = {
    list: $(".playlist"),
    play: $(".btn-toggle-play"),
    currenSong: $(".current-song-title"),
    audio: $(".audio-player"),
    icon: $(".play-icon"),
    next: $(".btn-next"),
    prev: $(".btn-prev"),
    input: $(".progress-bar"),
    start: $(".js-start"),
    end: $(".js-end"),
    loop: $(".btn-loop"),
    icon_volume: $(".js-volume-icon"),
    volume: $(".js-volume"),
    random: $(".btn-shuffle"),
    thumb: $(".cd-thumb"),
    body: document.body,

    isplay: false,
    currenindex: 0,
    isloop: false,
    isvolume: true,
    valueVolume: 0,
    lastVolume: 0,
    lastRandom: 0,
    // Danh sách bài hát
    songList: [
        {
            id: 1,
            filePath: "./songs/ChayNgayDi-SonTungMTP-5468704.mp3",
            title: "Chạy ngay đi",
            artist: "Sơn Tùng M-TP",
        },
        {
            id: 2,
            filePath:
                "./songs/CoChacYeuLaDayOnionnRemix-SonTungMTPOnionn-7022615.mp3",
            title: "Có Chắc yêu là đay",
            artist: "Sơn Tùng M-TP",
        },
        {
            id: 3,
            filePath: "./songs/HayTraoChoAnh-SonTungMTPSnoopDogg-6010660.mp3",
            title: "Hãy trao cho anh",
            artist: "Sơn Tùng M-TP ft. Snoop Dogg",
        },
        {
            id: 4,
            filePath: "./songs/Gu-FreakySeachains-7029816.mp3",
            title: "Gu",
            artist: "FreakySeachains",
        },
        {
            id: 5,
            filePath: "./songs/BeoDatMayTroi-ThuyChi-13750875.mp3",
            title: "bèo dạt mây trôi",
            artist: "Thùy Chi",
        },
    ],
    // hàm khởi tạo
    initialize() {
        this.handelGetState();
        this.renderPlaylist();
        this.loadCurrenSong();
        this.handleClickSong();
        this.handleInput();
        this.handleTime();
        this.handleLoop();
        this.handleVolume();
        this.handleDisableRandom();
        this.handleKeyBoard();

        // console.log(this.body);

        // dom evnet
        this.random.onclick = this.handleRandom.bind(this);
        this.icon_volume.onclick = this.handleIconVolume.bind(this);
        this.play.onclick = this.handle_play.bind(this);
        this.next.onclick = this.nextSong.bind(this);
        this.prev.onclick = this.prevSong.bind(this);
    },
    // random song
    handleRandom() {
        this.lastRandom = this.currenindex;
        this.handleRemoveRotate();
        let songRandom;
        if (this.songList.length !== 1) {
            do {
                songRandom = Math.floor(Math.random() * this.songList.length);
                console.log(songRandom);
            } while (songRandom === this.lastRandom);
            this.currenindex = songRandom;
            this.songList[this.currenindex].filePath;
            this.loadCurrenSong();
            if (this.isplay) {
                setTimeout(() => this.handleRotateThumb(), 0);
                this.audio.play();
                this.handleUserState();
            }
        }
    },
    // disable random
    handleDisableRandom() {
        if (this.songList.length <= 1) {
            this.random.classList.add("disable");
        } else {
            this.random.classList.remove("disable");
        }
    },
    // loop song
    handleLoop() {
        this.loop.onclick = () => {
            this.isloop = !this.isloop;
            if (this.isloop) {
                this.loop.classList.add("active");
                this.audio.loop = this.isloop;
            } else {
                this.audio.loop = this.isloop;
                this.loop.classList.remove("active");
            }
        };
    },
    // volumn
    handleVolume() {
        this.volume.oninput = () => {
            this.valueVolume = this.volume.value;
            this.audio.volume = this.valueVolume;
            this.lastVolume = this.volume.value;
            if (!this.audio.volume) {
                this.icon_volume.classList.replace(
                    "fa-volume-up",
                    "fa-volume-off"
                );
            } else {
                this.icon_volume.classList.replace(
                    "fa-volume-off",
                    "fa-volume-up"
                );
            }
        };
    },
    // icon volume
    handleIconVolume() {
        if (this.isvolume) {
            const valueVolume = 0;
            this.volume.value = valueVolume;
            this.audio.volume = valueVolume;
            this.isvolume = !this.isvolume;
            this.icon_volume.classList.replace("fa-volume-up", "fa-volume-off");
        } else {
            const valueVolume = this.lastVolume;
            this.volume.value = valueVolume;
            this.audio.volume = valueVolume;
            this.isvolume = !this.isvolume;
            this.icon_volume.classList.replace("fa-volume-off", "fa-volume-up");
        }
        this.handleUserState();
    },
    // tua nhạc
    handleInput() {
        this.input.oninput = (e) => {
            const value = e.target.value;
            this.audio.currentTime = (value / 100) * this.audio.duration;
        };
    },
    // update time
    handleTime() {
        this.audio.ontimeupdate = () => {
            const percent =
                (this.audio.currentTime / this.audio.duration) * 100;
            this.input.value = percent;
            this.handleGetStart();
            this.handleGetEnd();
            this.handleUserState();
            this.handleUserState();

            if (!this.isloop) {
                this.endSong();
            }
        };
    },

    // total time song runing
    handleGetStart() {
        const munius = Math.floor(this.audio.currentTime / 60);
        const second = Math.floor(this.audio.currentTime % 60);
        this.start.innerText = `${munius}p ${second}s`;
    },
    // total song times
    handleGetEnd() {
        const munius = Math.floor(this.audio.duration / 60);
        const second = Math.floor(this.audio.duration % 60);
        this.end.innerText = `${munius}p ${second}s`;
    },
    // bài hiện tại
    loadCurrenSong() {
        const currentSong = this.getCurrenSong();
        this.audio.src = currentSong.filePath;
        this.handleTitle();
        this.activeSong();
        this.handleUserState();
        // wait to loaded data to render
        this.audio.addEventListener("loadedmetadata", () => {
            this.input.value = 0;
            this.handleGetStart();
            this.handleGetEnd();
        });
    },
    // lấy bài hiện tại
    getCurrenSong() {
        return this.songList[this.currenindex];
    },
    // active
    activeSong() {
        const songs = $$(".song");
        songs.forEach((song, index) => {
            song.classList.toggle("active", index === this.currenindex);
        });
        // lấy tên bài nhạc
        this.handleTitle();
    },
    // đổi tên nhạc khi next bài
    handleTitle() {
        const currentSong = this.getCurrenSong();
        this.currenSong.innerText = currentSong.title;
    },
    // play
    handle_play() {
        if (this.audio.paused) {
            this.isplay = !this.isplay;
            this.audio.play();
            this.icon.classList.replace("fa-play", "fa-pause");
            this.handleRotateThumb();
        } else {
            this.isplay = !this.isplay;
            this.audio.pause();
            this.icon.classList.replace("fa-pause", "fa-play");
            this.thumb.classList.add("pause");
        }
    },
    // pause rotate thumb
    handleRotateThumb() {
        this.thumb.classList.add("cd-thumb-rotate");
        this.thumb.classList.remove("pause");
    },
    // remove rotate thumb
    handleRemoveRotate() {
        this.thumb.classList.remove("cd-thumb-rotate");
    },

    // next song
    nextSong() {
        this.handleRemoveRotate();
        this.isplay = true;
        this.currenindex++;
        this.currenindex = (this.currenindex + this.songList.length) % 5;
        let currentSong = this.getCurrenSong();
        this.activeSong();
        this.audio.src = currentSong.filePath;
        this.handleUserState();
        if (this.isplay) {
            this.audio.onloadeddata = () => {
                setTimeout(() => this.handleRotateThumb(), 0);
                this.icon.classList.replace("fa-play", "fa-pause");
                this.audio.play();
            };
        }
    },
    // return song
    prevSong() {
        this.handleRemoveRotate();
        this.isplay = true;
        this.currenindex--;
        this.currenindex = (this.currenindex + this.songList.length) % 5;
        let currentSong = this.getCurrenSong();
        this.activeSong();
        this.audio.src = currentSong.filePath;
        this.handleUserState();
        if (this.isplay) {
            this.audio.onloadeddata = () => {
                this.handleRotateThumb();
                this.icon.classList.replace("fa-play", "fa-pause");
                this.audio.play();
            };
        }
    },

    // if end Song
    endSong() {
        this.audio.onended = () => {
            if (!this.isloop) {
                this.nextSong();
            }
        };
    },

    // handle play click to list
    handleClickSong() {
        const songs = $$(".song");
        this.audio.addEventListener("loadedmetadata", () => {
            songs.forEach((song, index) => {
                song.onclick = (e) => {
                    this.handleRemoveRotate();
                    this.currenindex = index;
                    let currentSong = this.getCurrenSong();
                    this.activeSong();
                    this.audio.src = currentSong.filePath;
                    if (this.isplay) {
                        setTimeout(() => this.handleRotateThumb(), 0);
                        this.audio.play();
                    }
                };
            });
        });
    },

    // support keyboard
    handleKeyBoard() {
        this.body.addEventListener("keydown", (e) => {
            switch (e.code) {
                case "Space":
                    e.preventDefault();
                    this.handle_play();
                    break;
                case "ArrowRight":
                    this.nextSong();
                    break;
                case "ArrowLeft":
                    this.prevSong();
                    break;
                case "ArrowUp":
                    this.valueVolume = parseFloat(this.volume.value);
                    this.valueVolume = Math.min(1, this.valueVolume + 0.1);
                    this.volume.value = this.valueVolume;
                    this.audio.volume = this.valueVolume;
                    console.log(this.audio.volume);
                    console.log(this.volume.value);
                    break;
                case "ArrowDown":
                    this.valueVolume = parseFloat(this.volume.value);
                    this.valueVolume = Math.max(0, this.valueVolume - 0.1);
                    this.volume.value = this.valueVolume;
                    this.audio.volume = this.valueVolume;
                    console.log(this.audio.volume);
                    console.log(this.volume.value);
                    break;
            }
        });
    },

    // save user state
    handleUserState() {
        localStorage.setItem(
            "listener",
            JSON.stringify({
                index: this.currenindex,
                time: this.audio.currentTime,
                volume: this.audio.volume,
            })
        );
    },
    // get user state
    handelGetState() {
        const saved = JSON.parse(localStorage.getItem("listener"));
        if (saved) {
            this.currenindex = saved.index ?? 0;
            this.audio.currentTime = saved.time ?? 0;
            const volume = saved.volume ?? 0.5;
            this.audio.volume = volume;
            this.volume.value = volume;
        }
    },
    // Render danh sách bài hát ra HTML
    renderPlaylist() {
        const playlistHTML = this.songList
            .map((song, index) => {
                // Kiểm tra xem bài này có phải đang phát không
                const isCurrentSong = index === this.currenindex;

                return `<div class="song ${isCurrentSong ? "active" : ""}">
                    <div
                        class="thumb"
                        style="
                            background-image: url('https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg');
                        "
                    ></div>
                    <div class="body">
                        <h3 class="title">${this.escapeHTML(song.title)}</h3>
                        <p class="author">${this.escapeHTML(song.artist)}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>`;
            })
            .join("");

        // Cập nhật HTML của playlist
        this.list.innerHTML = playlistHTML;
    },

    escapeHTML(html) {
        // Kiểm tra input có hợp lệ không
        if (typeof html !== "string") {
            return "";
        }

        // Tạo một temporary div element để sử dụng textContent
        // textContent tự động escape các ký tự đặc biệt
        const tempDiv = document.createElement("div");
        tempDiv.textContent = html;
        return tempDiv.innerHTML;
    },
};

// Khởi tạo music player khi trang web load xong
musicPlayer.initialize();
