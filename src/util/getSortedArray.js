const getSortedArray = (array, property, isAsc) => {
    return array.sort((a, b) => {
        return (a[property] <= b[property] ? -1 : 1) * (isAsc ? 1 : -1)
    });
}

export default getSortedArray;