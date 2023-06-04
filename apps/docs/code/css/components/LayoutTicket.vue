<template>
  <div class="main-content">
    <div class="ticket">
      <div class="ticket__main">
        <div class="header">Hogwarts Express</div>
        <div class="info passenger">
          <div class="info__item">Passenger</div>
          <div class="info__detail">Hermione J. Granger</div>
        </div>
        <div class="info platform">
          <span>Depart </span><span>from </span><span>platform</span>
          <div class="number">
            <div>9</div>
            <div><span>3</span><span>4</span></div>
          </div>
        </div>
        <div class="info departure">
          <div class="info__item">Depart</div>
          <div class="info__detail">King's Cross</div>
        </div>
        <div class="info arrival">
          <div class="info__item">Arrive</div>
          <div class="info__detail">Hogsmeade</div>
        </div>
        <div class="info date">
          <div class="info__item">Date</div>
          <div class="info__detail">1 Sep 2018</div>
        </div>
        <div class="info time">
          <div class="info__item">Time</div>
          <div class="info__detail">11:00AM</div>
        </div>
        <div class="info carriage">
          <div class="info__item">car</div>
          <div class="info__detail">4</div>
        </div>
        <div class="info seat">
          <div class="info__item">Seat</div>
          <div class="info__detail">6B</div>
        </div>
        <div class="fineprint">
          <p>
            Boarding begins 30 minutes before departure. Snacks available for
            purchase from The Honeydukes Express.
          </p>
          <p>This ticket is XXXX Railway Authority</p>
        </div>
        <div class="snack">
          <svg viewBox="0 -11 414.00053 414">
            <path
              d="m202.480469 352.128906c0-21.796875-17.671875-39.46875-39.46875-39.46875-21.800781 0-39.472657 17.667969-39.472657 39.46875 0 21.800782 17.671876 39.472656 39.472657 39.472656 21.785156-.023437 39.445312-17.683593 39.46875-39.472656zm0 0"
            />
            <path
              d="m348.445312 348.242188c2.148438 21.691406-13.695312 41.019531-35.390624 43.167968-21.691407 2.148438-41.015626-13.699218-43.164063-35.390625-2.148437-21.691406 13.695313-41.019531 35.386719-43.167969 21.691406-2.148437 41.019531 13.699219 43.167968 35.390626zm0 0"
            />
            <path
              d="m412.699219 63.554688c-1.3125-1.84375-3.433594-2.941407-5.699219-2.941407h-311.386719l-3.914062-24.742187c-3.191407-20.703125-21.050781-35.9531252-42-35.871094h-42.699219c-3.867188 0-7 3.132812-7 7s3.132812 7 7 7h42.699219c14.050781-.054688 26.03125 10.175781 28.171875 24.0625l33.800781 213.515625c3.191406 20.703125 21.050781 35.957031 42 35.871094h208.929687c3.863282 0 7-3.132813 7-7 0-3.863281-3.136718-7-7-7h-208.929687c-14.050781.054687-26.03125-10.175781-28.171875-24.0625l-5.746094-36.300781h213.980469c18.117187-.007813 34.242187-11.484376 40.179687-28.597657l39.699219-114.578125c.742188-2.140625.402344-4.511718-.914062-6.355468zm0 0"
            />
          </svg>
        </div>
        <div class="barcode">
          <div class="barcode__scan" />
          <div class="barcode__id">001256733</div>
        </div>
      </div>
      <div class="ticket__side">
        <div class="logo">
          <p>Hogwarts Express</p>
        </div>
        <div class="info side-arrive">
          <div class="info__item">Arrive</div>
          <div class="info__detail">Hogsmeade</div>
        </div>
        <div class="info side-depart">
          <div class="info__item">Depart</div>
          <div class="info__detail">King's Cross</div>
        </div>
        <div class="info side-date">
          <div class="info__item">Date</div>
          <div class="info__detail">1 Sep 2018</div>
        </div>
        <div class="info side-time">
          <div class="info__item">Time</div>
          <div class="info__detail">11:00AM</div>
        </div>
        <div class="barcode">
          <div class="barcode__scan" />
          <div class="barcode__id">001256733</div>
        </div>
      </div>
    </div>
  </div>
  <a href="https://codepen.io/oliviale/pen/MZZYyO" target="_blank"
    >SS Grid: Train Ticket</a
  >
</template>

<style scoped lang="scss">
$gray-light: #faf8f6;
$brown-light: #dfd4b8;
$gold: #e7ac5d;
$red: #c02a28;
$yellow-light: #f3f1c9;
$border-color: #444;

.main-content {
  margin: 4em auto 0;
  width: 740px;
  text-transform: uppercase;
  p {
    line-height: 14px;
    margin: 0;
  }
}

.ticket {
  display: grid;
  grid-template-columns: auto 143px;
  background: $yellow-light;
  border-radius: 10px;
  border: 2px solid #222;
  cursor: default;
  &__main {
    display: grid;
    grid-template-columns: repeat(6, 1fr) 120px;
    grid-template-rows: repeat(4, min-content) auto;
    padding: 10px;
  }
}

.header {
  grid-area: title;
  grid-column: span 7;
  grid-row: 1;
  font: 900 38px 'Montserrat', sans-serif;
  padding: 5px 0 5px 20px;
  letter-spacing: 6px;
  background: #111;
  color: $yellow-light;
}

.info {
  border: 3px solid;
  border-width: 0 3px 3px 0;
  padding: 8px;
  &__item {
    font: 400 13px 'Questrial', sans-serif;
    letter-spacing: 0.5px;
  }
  &__detail {
    font: 700 20px/1 'Jura';
    letter-spacing: 1px;
    margin: 4px 0;
  }
}

.passenger {
  grid-column: 1 / span 6;
}

.platform {
  grid-column: 7 / span 1;
  grid-row: 2 / span 3;
  background: $red;
  color: #fff;
  border-color: #000;
  text-align: center;
  padding: 10px 0;
  span {
    display: block;
  }
  span:nth-child(1) {
    font: 900 22px/1 'Montserrat';
    letter-spacing: 1.5px;
  }
  span:nth-child(2) {
    font: 900 29px/1 'Montserrat';
    letter-spacing: 3px;
  }
  span:nth-child(3) {
    font: 900 16px/1.2 'Montserrat';
    letter-spacing: 0.5px;
  }
  .number {
    display: flex;
    margin-top: 12px;
    position: relative;
    div:nth-child(1) {
      position: absolute;
      left: 16px;
      font: 900 90px/1 'Old Standard TT';
    }
    span {
      font: 900 36px/1 'Old Standard TT';
      position: absolute;
      right: 18px;
      &:nth-child(1) {
        top: -2px;
        border-bottom: 2px solid;
        padding: 0 2px;
      }
      &:nth-child(2) {
        top: 44px;
      }
    }
  }
}

.departure,
.arrival {
  grid-column-start: span 3;
}

.passenger,
.departure,
.date {
  border-left: 3px solid;
}

.date,
.time {
  grid-column-start: span 2;
}

.fineprint {
  grid-column-start: span 5;
  font-size: 14px;
  font-family: 'Inconsolata';
  line-height: 1;
  margin-top: 10px;
  padding-right: 5px;
  font-size: 12px;
  p:nth-child(2) {
    margin: 4px 4px 0 0;
    padding-top: 4px;
    border-top: 1.5px dotted;
    font-size: 11px;
    line-height: 1;
  }
}

.snack {
  grid-column: 6 / span 1;
  width: 65px;
  margin: 10px 10px 0 0;
  position: relative;
  background: #000;
  padding: 6px 0 2px;
  text-align: center;
  border-radius: 5px;
  svg {
    fill: $yellow-light;
    width: 36px;
    display: inline;
  }
  &__name {
    color: $yellow-light;
    font-size: 12px;
  }
}

.barcode {
  grid-column-start: span 1;
  display: grid;
  margin: 10px 0 0;
  grid-template-rows: 1fr min-content;
  &__scan {
    background: linear-gradient(
      to right,
      #333 2%,
      #333 4%,
      transparent 4%,
      transparent 5%,
      #333 5%,
      #333 6%,
      transparent 6%,
      #333 6%,
      #333 8%,
      transparent 8%,
      transparent 9%,
      #333 9%,
      #333 10.5%,
      transparent 10.5%,
      transparent 11%,
      #333 11%,
      #333 12%,
      transparent 12%,
      transparent 13.5%,
      #333 13.5%,
      #333 15%,
      #333 17%,
      transparent 17%,
      transparent 19%,
      #333 19%,
      #333 20%,
      transparent 20%,
      transparent 21%,
      #333 21%,
      #333 22%,
      transparent 22%,
      transparent 23.5%,
      #333 23.5%,
      #333 25%,
      transparent 25%,
      transparent 26.5%,
      #333 26.5%,
      #333 27.5%,
      transparent 27.5%,
      transparent 28.5%,
      #333 28.5%,
      #333 30%,
      transparent 30%,
      transparent 32%,
      #333 32%,
      #333 34%,
      #333 36%,
      transparent 36%,
      transparent 37.5%,
      #333 37.5%,
      #333 40%,
      transparent 40%,
      transparent 41.5%,
      #333 41.5%,
      #333 43%,
      transparent 43%,
      transparent 46%,
      #333 46%,
      #333 48%,
      transparent 48%,
      transparent 49%,
      #333 49%,
      transparent 49%,
      transparent 50%,
      #333 50%,
      #333 51%,
      transparent 51%,
      transparent 53%,
      #333 53%,
      #333 54.5%,
      transparent 54.5%,
      transparent 56%,
      #333 56%,
      #333 58%,
      transparent 58%,
      transparent 59%,
      #333 59%,
      #333 60%,
      #333 62.5%,
      transparent 62.5%,
      transparent 64%,
      #333 64%,
      #333 64%,
      #333 67%,
      transparent 67%,
      transparent 69%,
      #333 69%,
      #333 70%,
      transparent 70%,
      transparent 71%,
      #333 71%,
      #333 72%,
      transparent 72%,
      transparent 73.5%,
      #333 73.5%,
      #333 76%,
      transparent 76%,
      transparent 79%,
      #333 79%,
      #333 80%,
      transparent 80%,
      transparent 82%,
      #333 82%,
      #333 82.5%,
      transparent 82.5%,
      transparent 84%,
      #333 84%,
      #333 87%,
      transparent 87%,
      transparent 89%,
      #333 89%,
      #333 91%,
      transparent 91%,
      transparent 92%,
      #333 92%,
      #333 95%,
      transparent 95%
    );
  }
  &__id {
    letter-spacing: 4px;
    padding: 2px 0 0;
    color: $red;
    font: 700 16px/1 'Jura';
  }
}

.ticket__side {
  background: rgba($red, 0.2);
  box-sizing: border-box;
  border-left: 1.5px dashed #111;
  display: grid;
  grid-template-rows: repeat(2, 124px) 60px;
  grid-template-columns: 40px repeat(2, 45px);
  border-radius: 0 10px 10px 0;
  .logo {
    text-align: center;
    background: $red;
    padding: 10px 5px 10px 0px;
    margin: 10px 0 0 10px;
    font: 900 16px/1 'Montserrat';
    letter-spacing: 1.5px;
    grid-column: 1 / span 1;
    grid-row: 1 / span 2;
    position: relative;
    color: #fff;
    writing-mode: vertical-rl;
    p {
      transform: rotate(180deg);
    }
  }
  .info {
    border: 3px solid $red;
    border-width: 3px 3px 0;
    grid-column-start: 2;
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    &.side-arrive {
      margin-top: 10px;
      border-width: 3px;
    }
    &.side-date {
      grid-column-start: 3;
      border-right: none;
    }
    &.side-time {
      grid-column: 3 / span 1;
      grid-row: 1;
      margin-top: 10px;
      border-width: 3px 0 3px 3px;
    }
    &__item {
      font-size: 11px;
      color: $red;
    }
    &__detail {
      font-size: 12px;
      margin: 0 2px 0 0;
      letter-spacing: 0px;
    }
  }
  .barcode {
    grid-template-rows: 30px min-content;
    grid-row-start: 3;
    grid-column: 1 / span 3;
    margin: 9px 0 0 10px;
    text-align: center;
  }
}
</style>
