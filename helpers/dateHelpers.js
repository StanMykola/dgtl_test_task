exports.getDateArrayBetween = (from, to) => {
    const arrOfDates = [];
    const dateFrom = new Date(from);
    const dateTo = new Date(to);

    if (dateFrom > dateTo) {
        throw new Error("Date 'to' can't be greater than the date 'from'");
    }

    for (dateFrom; dateFrom <= dateTo; dateFrom.setDate(dateFrom.getDate() + 1)) {
        arrOfDates.push(new Date(dateFrom));
    }

    return arrOfDates.map((date) => date.toISOString().split('T')[0]);
};
