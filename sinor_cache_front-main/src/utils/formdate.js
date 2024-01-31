const days = ['일', '월', '화', '수', '목', '금', '토'];

const getFormatDate = (date) => {
  return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()} ${
    days[date.getDay()]
  }요일`;
};

export default getFormatDate;
