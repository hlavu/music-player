/**
 * 1. Render songs
 * 2. Scroll top
 * 3. Play/pause/seek
 * 4. CD rotate
 * 5. Next/prev
 * 6. Random
 * 7. Next/ repeat when ended
 * 8. Active song
 * 9. Scroll active song info view
 * 10. Play song when click
 */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const audio = $("#audio");
const playing = $(".playing");
const cd = $(".cd");
const playBtn = $(".play");
const progress = $(".progress");
const nextBtn = $(".next");
const prevBtn = $(".prev");
const shufBtn = $(".shuf");
const repeatBtn = $(".repeat");
const currentTime = $("#currentTime");
const timeLeft = $("#timeLeft");
const playlist = $(".list-song");
const MUSIC_PLAYER_STORAGE = "musicPlayerStorage";

const app = {
  currentIdx: 0,
  isPlaying: false,
  isRandom: false,
  playedSongs: [],
  songs: [
    {
      name: "2 AM",
      singer: "JustaTee x Big Daddy",
      path: "./assets/audio/2am.mp3",
      image: "./assets/img/2am.jpg",
    },
    {
      name: "Anh Chưa Thương Em Đến Vậy Đâu",
      singer: "Lady Mây",
      path: "./assets/audio/actedvd.mp3",
      image: "./assets/img/actedvd.jpg",
    },
    {
      name: "Ánh Sao Và Bầu Trời",
      singer: "T.R.I x Cá",
      path: "./assets/audio/asvbt.mp3",
      image: "./assets/img/asvbt.jpg",
    },
    {
      name: "Buồn Không Thể Buông",
      singer: "Trung Quân Idol",
      path: "./assets/audio/buon-khong-the-buong.mp3",
      image: "./assets/img/bktb.jpg",
    },
    {
      name: "Chuyện Đôi Ta",
      singer: "Emcee L (Da LAB) x Muội",
      path: "./assets/audio/chuyen-doi-ta.mp3",
      image: "./assets/img/cdt.jpg",
    },
    {
      name: "Có Ai Thương Em Như Anh",
      singer: "Tóc Tiên",
      path: "./assets/audio/catena.mp3",
      image: "./assets/img/catena.jpg",
    },
    {
      name: "Dạ Vũ",
      singer: "Miêu Quý Tộc",
      path: "./assets/audio/da-vu.mp3",
      image: "./assets/img/dv.jpg",
    },

    {
      name: "Forget Me Now",
      singer: "fishy x Trí Dũng",
      path: "./assets/audio/forget-me-now.mp3",
      image: "./assets/img/fmn.jpg",
    },
    {
      name: "Sài Gòn Hôm Nay Mưa",
      singer: "JSOL x Hoàng Duyên",
      path: "./assets/audio/sghnm.mp3",
      image: "./assets/img/sghnm.jpg",
    },

    {
      name: "Thức Giấc",
      singer: "Da LAB",
      path: "./assets/audio/thuc-giac.mp3",
      image: "./assets/img/tg.jpg",
    },
    {
      name: "Tự Sự",
      singer: "Orange x Thuận Nguyễn",
      path: "./assets/audio/tu-su.mp3",
      image: "./assets/img/ts.jpg",
    },
  ],
  config: JSON.parse(localStorage.getItem(MUSIC_PLAYER_STORAGE)) || {},

  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(MUSIC_PLAYER_STORAGE, JSON.stringify(this.config));
  },

  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    audio.loop = this.config.isRepeat;
  },
  loadCurrentSong: function () {
    audio.src = this.songs[this.currentIdx].path;
    $(".song-img").style.backgroundImage = `url("${
      this.songs[this.currentIdx].image
    }")`;
    $("#song-name").innerHTML = this.songs[this.currentIdx].name;
  },
  resetControl: function () {
    audio.currentTime = 0;
    progress.value = 0;
  },
  updateProgressBar: function (value) {
    // set progress bar based on percentage
    const percentage =
      ((value - progress.min) / (progress.max - progress.min)) * 100;
    progress.style.backgroundImage = `linear-gradient(90deg, rgba(40, 48, 72, 0.5) ${percentage}%, transparent ${percentage}%)`;

    let curMins = Math.floor(audio.currentTime / 60);
    let curSecs = (audio.currentTime - curMins * 60).toFixed();

    let remainingTime = audio.duration - audio.currentTime;
    let leftMins = Math.floor(remainingTime / 60);
    let leftSecs = (remainingTime - leftMins * 60).toFixed();

    currentTime.innerHTML = `${curMins}:${
      curSecs < 10 ? `0${curSecs}` : curSecs
    }`;

    timeLeft.innerHTML = `-${leftMins}:${
      leftSecs < 10 ? `0${leftSecs}` : leftSecs
    }`;
  },
  nextSong: function () {
    this.currentIdx++;
    if (this.currentIdx >= this.songs.length) {
      this.currentIdx = 0;
    }
    this.resetControl();
    this.loadCurrentSong();
  },

  prevSong: function () {
    this.currentIdx--;
    if (this.currentIdx < 0) {
      this.currentIdx = this.songs.length - 1;
    }
    this.resetControl();
    this.loadCurrentSong();
  },
  randomSong: function () {
    let randomIdx;
    do {
      randomIdx = Math.floor(Math.random() * this.songs.length);
    } while (
      this.currentIdx === randomIdx ||
      this.playedSongs.includes(randomIdx)
    );
    this.currentIdx = randomIdx;

    // save played songs to avoid repetition
    this.playedSongs.push(this.currentIdx);
    this.loadCurrentSong();

    // clear array when all songs are played
    if (this.playedSongs.length === this.songs.length) {
      this.playedSongs = [];
    }
  },
  scrollToSongView: function () {
    let block = "center";
    if (this.currentIdx < 5) {
      block = "end";
    }

    $(".song-info.active").scrollIntoView({
      behavior: "smooth",
      block: block,
    });
  },
  render: function () {
    const htmls = this.songs.map((song, idx) => {
      return `
            <div class="song-info" id="song-${idx}" data-index=${idx} >
            <div class="info-img" style="background-image:url(${song.image})">
            </div>
            
            <div class="boxContainer">
                <div class="box box1 "></div>
                <div class="box box2"></div>
                <div class="box box3"></div>
                <div class="box box4"></div>
                <div class="box box5"></div>
                <div class="box box6"></div>
              </div>
            <div class="info-text">
              <h2>${song.name}</h2>
              <span>${song.singer}</span>
            </div>
            <div class="dot">
              <i class="bx bx-dots-horizontal-rounded"></i>
            </div>
          </div>
            `;
    });

    $(".list-song").innerHTML = htmls.join("");
    repeatBtn.classList.toggle("active", audio.loop);
    shufBtn.classList.toggle("active", app.isRandom);
  },

  runningLongName: function () {
    let hasLongName = false;
    if (this.songs[this.currentIdx].name.length > 27) {
      hasLongName = true;
    }
    if (hasLongName) {
      $("#song-name").classList.add("long-text");
    }
  },
  renderCurrentPlaying: function () {
    $$(".song-info").forEach((song) => song.classList.toggle("active", false));
    $(`#song-${this.currentIdx}`).classList.add("active");
    $(`#song-${this.currentIdx}`).classList.toggle("paused", !this.isPlaying);
  },
  handleEvents: function () {
    // handle CD zoom in, out
    const cdWidth = cd.offsetWidth;
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;

      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    // handle rotate CD
    const cdAnimated = cd.animate(
      // keyframes
      { transform: "rotate(360deg)" },
      // timing options
      {
        duration: 10000,
        iterations: Infinity,
      }
    );

    cdAnimated.pause();

    // handle play/pause btn
    playBtn.onclick = function () {
      if (app.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    audio.onplay = function () {
      app.isPlaying = true;
      playBtn.classList.add("active");
      cdAnimated.play();
      $("#song-name").classList.toggle("long-text", !app.isPlaying);
      app.runningLongName();
      app.renderCurrentPlaying();
      app.scrollToSongView();
    };

    audio.onpause = function () {
      app.isPlaying = false;
      playBtn.classList.remove("active");
      $("#song-name").classList.toggle("long-text", app.isPlaying);
      $(`#song-${app.currentIdx}`).classList.toggle("paused", !app.isPlaying);

      cdAnimated.pause();
    };

    // handle progress bar
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
        app.updateProgressBar(progress.value);
      }
    };

    // handle skip event
    progress.oninput = function (e) {
      const nextPos = e.target.value;
      const newCurrentTime = (audio.duration / 100) * nextPos;
      audio.currentTime = newCurrentTime;
    };

    // handle next song
    nextBtn.onclick = function () {
      if (!app.isRandom) {
        app.nextSong();
      } else {
        app.randomSong();
      }
      audio.play();
    };

    // handle previous song
    prevBtn.onclick = function () {
      if (!app.isRandom) {
        app.prevSong();
      } else {
        app.randomSong();
      }

      audio.play();
    };

    // handle shuffle song
    shufBtn.onclick = function () {
      app.isRandom = !app.isRandom;
      app.setConfig("isRandom", app.isRandom);
      shufBtn.classList.toggle("active", app.isRandom);
      if (app.isRandom) {
        app.randomSong();
        audio.play();
      }
    };

    // handle loop btn
    repeatBtn.onclick = function () {
      audio.loop = !audio.loop;
      app.setConfig("isRepeat", audio.loop);
      repeatBtn.classList.toggle("active", audio.loop);
      audio.play();
    };

    // handle auto next song when the current song is finished
    audio.onended = function () {
      if (!audio.loop) {
        if (!app.isRandom) {
          app.nextSong();
        } else {
          app.randomSong();
        }
      }
      audio.play();
    };

    // handle click on a song
    playlist.onclick = function (e) {
      const clickedSong = e.target.closest(".song-info:not(.active)");

      if (e.target.closest(".dot")) {
        // logic for options
      } else if (clickedSong) {
        app.currentIdx = clickedSong.dataset.index;
        app.loadCurrentSong();
        audio.play();
      }
    };
  },
  start: function () {
    this.loadConfig();
    this.handleEvents();
    this.loadCurrentSong();
    this.render();
  },
};

app.start();
