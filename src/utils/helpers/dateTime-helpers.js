function compareTime(departureTime, arrivalTime) {
    const dep = new Date(departureTime);
    const arr = new Date(arrivalTime);

    return dep.getTime() >= arr.getTime(); // true if invalid (departure ≥ arrival)
}

module.exports = {
    compareTime
};