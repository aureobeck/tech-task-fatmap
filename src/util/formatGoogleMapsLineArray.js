const formatGoogleMapsLineArray = lineArray =>
lineArray.map(line =>
            line.map(point => {
                return {
                    "lat": point[1],
                    "lng": point[0],
                }
            })
    );


export default formatGoogleMapsLineArray;