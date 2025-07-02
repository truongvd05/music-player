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
    searchForm: $(".js-search"),
    searchInput: $(".js-input"),
    allSongs: $(".wrap-btn"),
    AllBtn: $(".btn-all"),
    LoveBtn: $(".btn-love"),

    params: new URLSearchParams(location.search),

    isplay: false,
    currenindex: 0,
    isloop: false,
    isvolume: true,
    valueVolume: 0,
    lastVolume: 0.4,
    lastRandom: 0,
    songIndex: 0,
    songId: 0,
    ArrLoveSong: [],
    // Danh sách bài hát
    songList: [
        {
            id: 1,
            filePath: "./songs/ChayNgayDi-SonTungMTP-5468704.mp3",
            title: "Chạy ngay đi",
            artist: "Sơn Tùng M-TP",
            isheart: false,
        },
        {
            id: 2,
            filePath:
                "./songs/CoChacYeuLaDayOnionnRemix-SonTungMTPOnionn-7022615.mp3",
            title: "Có Chắc yêu là đay",
            artist: "Sơn Tùng M-TP",
            isheart: false,
        },
        {
            id: 3,
            filePath: "./songs/ThuDoCypher.mp3",
            title: "Thủ Đô Cypher (Quang Nhật Remix)",
            artist: "Beck'Stage X Biti's Hunter",
            isheart: false,
        },
        {
            id: 4,
            filePath: "./songs/Gu-FreakySeachains-7029816.mp3",
            title: "Gu",
            artist: "FreakySeachains",
            isheart: false,
        },
        {
            id: 5,
            filePath: "./songs/BeoDatMayTroi-ThuyChi-13750875.mp3",
            title: "Bèo dạt mây trôi",
            artist: "Thùy Chi",
            isheart: false,
        },
        {
            id: 6,
            filePath: "./songs/LayChongSomLamGi-HuyRTuanCry-6175716.mp3",
            title: "Lấy Chồng Sớm Làm Gì",
            artist: "HuyR, Tuấn Cry",
            isheart: false,
        },
        {
            id: 7,
            filePath: "./songs/MatMoc-PhamNguyenNgocVAnhAnNhi-7793420.mp3",
            title: "Mặt mộc",
            artist: "Phạm Nguyên Ngọc x VAnh x Ân Nhi",
            isheart: false,
        },
        {
            id: 8,
            filePath: "./songs/SeeTinhCucakRemix-HoangThuyLinh-7208579.mp3",
            title: "See tình",
            artist: "Hoàng Thùy Linh",
            isheart: false,
        },
    ],
    // hàm khởi tạo
    initialize() {
        this.handleBtnAll();
        this.handleBtnLove();
        this.handelGetState();
        this.handleURL();
        this.renderPlaylist();
        this.loadCurrenSong();
        this.handleInput();
        this.handleTime();
        this.handleLoop();
        this.handleVolume();
        this.handleDisableRandom();
        this.handleKeyBoard();
        this.handleFirst();
        this.handleSearch();
        this.handleClickLove();
        this.endSong();
        this.handleGetEnd();
        this.handleGetLoveSong();
        this.handleClickSong();

        // dom evnet
        this.random.onclick = this.handleRandom.bind(this);
        this.icon_volume.onclick = this.handleIconVolume.bind(this);
        this.play.onclick = this.handle_play.bind(this);
        this.next.onclick = this.nextSong.bind(this);
        this.prev.onclick = this.prevSong.bind(this);
    },
    // scroll songs
    handleScroll() {
        const songs = $$(".song");
        const currenSong = songs[this.currenindex];
        const offset = 500;
        const rect = currenSong.getBoundingClientRect();
        window.scrollTo({
            top: window.scrollY + rect.top - offset,
            behavior: "smooth",
        });
    },
    // search songs
    handleSearch() {
        this.searchForm.addEventListener("click", (e) => {
            this.searchForm.classList.add("search-active");
            this.searchInput.focus();
            // remove keydown when searching
            this.body.removeEventListener("keydown", this.bindFunctionKeyDown);
        });
        this.searchInput.addEventListener("blur", () => {
            if (!this.searchInput.value.trim()) {
                this.searchForm.classList.remove("search-active");
                // add keydown
                setTimeout(() => this.handleKeyBoard(), 0);
            }
        });
        // search songs
        this.searchInput.addEventListener("input", (event) => {
            const searchValue = event.target.value.trim().toLowerCase();
            const newSong = this.songList.filter((song) => {
                return song.title.includes(String(searchValue.toLowerCase()));
            });
            this.renderPlaylist(newSong);
        });
    },
    // handel URL
    handleURL() {
        this.songId = this.list.id;
        this.songIndex = this.params?.get(this.songId) ?? this.currenindex;
    },
    // first active
    handleFirst() {
        const songs = $$(".song");
        songs[this.currenindex].classList.add("active");
    },
    // random song
    handleRandom() {
        this.handleClickSong();
        this.lastRandom = this.currenindex;
        this.handleRemoveRotate();
        let songRandom;
        if (this.songList.length !== 1) {
            do {
                songRandom = Math.floor(Math.random() * this.songList.length);
            } while (songRandom === this.lastRandom);
            this.currenindex = songRandom;
            this.handleScroll(this.currenindex);
            this.songList[this.currenindex].filePath;
            this.loadCurrenSong();
            if (this.isplay) {
                setTimeout(() => this.handleRotateThumb(), 0);
                this.audio.oncanplay = () => {
                    this.audio.play();
                    this.handleUserState();
                };
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
            this.handleUserState();
        };
    },
    // total time song runing
    handleGetStart() {
        const munius = Math.floor(this.audio.currentTime / 60);
        const second = Math.floor(this.audio.currentTime % 60)
            .toString()
            .padStart(2, "0");
        this.start.innerText = `${munius}:${second}`;
    },
    // total song times
    handleGetEnd() {
        const minutes = Math.floor(this.audio.duration / 60);
        const seconds = Math.floor(this.audio.duration % 60)
            .toString()
            .padStart(2, "0");
        this.end.innerText = `${minutes}:${seconds}`;
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
    // active song
    activeSong() {
        const current = $$(".song.active")[0];
        const songs = $$(".song");
        if (current) current.classList.remove("active");
        const newActive = songs[this.currenindex];
        if (newActive) newActive.classList.add("active");
        // Cập nhật tiêu đề
        this.handleTitle();
    },
    // update title
    handleTitle() {
        this.currenSong.innerText = this.getCurrenSong().title;
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
        this.currenindex =
            (this.currenindex + this.songList.length) % this.songList.length;
        let currentSong = this.getCurrenSong();
        this.songId = this.songIndex;
        this.activeSong();
        this.audio.src = currentSong.filePath;
        this.handleUserState();
        this.handleParam(this.currenindex);
        this.handleScroll();
        if (this.isplay) {
            this.audio.oncanplay = () => {
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
        this.currenindex =
            (this.currenindex + this.songList.length) % this.songList.length;
        let currentSong = this.getCurrenSong();
        this.activeSong();
        this.audio.src = currentSong.filePath;
        this.handleUserState();
        this.handleScroll();
        if (this.isplay) {
            this.audio.oncanplay = () => {
                setTimeout(() => this.handleRotateThumb(), 0);
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
    // btn all
    handleBtnAll() {
        this.AllBtn.onclick = () => {
            this.LoveBtn.classList.remove("btn-active");
            this.AllBtn.classList.add("btn-active");
            this.handleGetLoveSong();
            this.handleClickSong();
        };
    },
    // Favorite songs
    handleBtnLove() {
        this.LoveBtn.onclick = () => {
            this.AllBtn.classList.remove("btn-active");
            this.LoveBtn.classList.add("btn-active");
        };
    },
    // click love song
    handleClickLove() {
        this.LoveBtn.addEventListener("click", () => {
            const loveSong = JSON.parse(localStorage.getItem("loveSong")) || [];
            this.handleBtnLove();
            this.renderPlaylist(loveSong);
            this.handleClickSong();
        });
    },
    // handle param
    handleParam(index) {
        this.songId = this.list.id;
        if (index) {
            this.params.set(this.songId, this.songList[index].title);
        } else {
            this.params.delete(this.songId, this.songList[index].title);
        }
        const Url = this.params.size ? `?${this.params}` : "";
        const saveUrl = `${location.pathname}${Url}${location.hash}`;
        history.replaceState(null, null, saveUrl);
    },
    // heart active
    handleHeart(heartActive, index) {
        heartActive.classList.toggle("heart-active");
        if (heartActive.classList.contains("heart-active")) {
            this.songList[index].isheart = true;
            this.ArrLoveSong.unshift(this.songList[index]);
        } else {
            this.songList[index].isheart = false;
            this.ArrLoveSong.shift(this.songList[index]);
        }
        localStorage.setItem("loveSong", JSON.stringify(this.ArrLoveSong));
    },
    // get Love song
    handleGetLoveSong() {
        const loveSong = JSON.parse(localStorage.getItem("loveSong")) || [];
        this.songList.forEach((song) => {
            const isloved = loveSong.find((love) => song.id === love.id);
            song.isheart = isloved;
        });

        this.renderPlaylist(this.songList);
    },
    // handle play click to list
    handleClickSong() {
        const songs = $$(".song");
        songs.forEach((song, index) => {
            song.onclick = (e) => {
                const heartActive = e.target.closest(".heart");
                if (heartActive) {
                    this.handleHeart(heartActive, index);
                } else {
                    this.handleRemoveRotate();
                    this.currenindex = index;
                    this.currentSong = this.getCurrenSong();
                    this.activeSong();
                    this.audio.src = this.currentSong.filePath;
                    this.handleURL();
                    this.handleParam(this.currenindex);
                    if (this.isplay) {
                        this.audio.oncanplay = () => {
                            setTimeout(() => this.handleRotateThumb(), 0);
                            this.audio.play();
                        };
                    }
                }
            };
        });
    },
    // key event
    functionKeyDown(e) {
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
                e.preventDefault();
                this.valueVolume = parseFloat(this.volume.value);
                this.valueVolume = Math.min(1, this.valueVolume + 0.1);
                this.volume.value = this.valueVolume;
                this.audio.volume = this.valueVolume;
                break;
            case "ArrowDown":
                e.preventDefault();
                this.valueVolume = parseFloat(this.volume.value);
                this.valueVolume = Math.max(0, this.valueVolume - 0.1);
                this.volume.value = this.valueVolume;
                this.audio.volume = this.valueVolume;
                break;
            case "KeyM":
                e.preventDefault();
                this.handleIconVolume();
                break;
            case "KeyL":
                e.preventDefault();
                this.isloop = !this.isloop;

                if (this.isloop) {
                    this.loop.classList.add("active");
                    this.audio.loop = this.isloop;
                } else {
                    this.audio.loop = this.isloop;
                    this.loop.classList.remove("active");
                }
                break;
            case "KeyR":
                this.handleRandom();
        }
    },
    // support keyboard
    handleKeyBoard() {
        this.bindFunctionKeyDown = this.functionKeyDown.bind(this);
        this.body.addEventListener("keydown", this.bindFunctionKeyDown);
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
    renderPlaylist(data = this.songList) {
        if (!data.length) {
            return (this.list.innerHTML = `<p>Không có kết quả nào</p>`);
        }
        const playlistHTML = data
            .map((song, index) => {
                // Kiểm tra xem bài này có phải đang phát không
                const isCurrentSong = index === this.currenindex;
                return `<div class="song ${
                    isCurrentSong ? "active" : ""
                }" data-index="${index}">
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
                    <i class="fas fa-heart heart ${
                        song.isheart ? "heart-active" : ""
                    }"></i>
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
