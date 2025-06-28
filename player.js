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
    random: $(".fa-random"),

    isplay: false,
    currenindex: 0,
    isloop: false,
    isvolume: true,
    valueVolume: 0,
    lastVolume: 0,
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
        this.renderPlaylist();
        this.loadCurrenSong();
        this.handleClickSong();
        this.handleInput();
        this.handleTime();
        this.handleLoop();
        this.endSong();
        this.handleVolume();

        // console.log(this.random);

        // dom evnet
        this.icon_volume.onclick = this.handleIconVolume.bind(this);
        this.play.onclick = this.handle_play.bind(this);
        this.next.onclick = this.nextSong.bind(this);
        this.prev.onclick = this.prevSong.bind(this);
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
            valueVolume = this.volume.value;
            this.audio.volume = valueVolume;
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
            if (!this.isloop) {
                this.endSong();
            }
        };
    },
    // total song runing
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
        // đổi tên bài nhạc
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
        } else {
            this.isplay = !this.isplay;
            this.audio.pause();
            this.icon.classList.replace("fa-pause", "fa-play");
        }
    },

    // next song
    nextSong() {
        this.isplay = true;
        this.currenindex++;
        this.currenindex = (this.currenindex + this.songList.length) % 5;
        let currentSong = this.getCurrenSong();
        this.activeSong();
        this.audio.src = currentSong.filePath;
        if (this.isplay) {
            this.icon.classList.replace("fa-play", "fa-pause");
            this.audio.play();
        }
    },

    // end Song
    endSong() {
        if (this.audio.ended) {
            this.nextSong();
        }
    },
    // return song
    prevSong() {
        this.isplay = true;

        this.currenindex--;
        this.currenindex = (this.currenindex + this.songList.length) % 5;
        let currentSong = this.getCurrenSong();
        this.activeSong();
        if (this.isplay) {
            this.icon.classList.replace("fa-play", "fa-pause");
            this.audio.src = currentSong.filePath;
            this.audio.play();
        }
    },
    // handle play click to list
    handleClickSong() {
        this.isplay = true;

        const songs = $$(".song");
        songs.forEach((song, index) => {
            song.onclick = (e) => {
                this.currenindex = index;
                let currentSong = this.getCurrenSong();
                this.activeSong();
                if (this.isplay) {
                    this.audio.src = currentSong.filePath;
                    this.audio.play();
                }
            };
        });
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
