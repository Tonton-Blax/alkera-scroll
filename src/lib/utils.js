
/**
 * @param {number[]} pointsGroup1
 * @param {number[]} pointsGroup2 
 *@returns {{ direction: 1 | -1, progress: number }} 1 for CW / -1 for CCW
 */
export function getDirection(pointsGroup1, pointsGroup2) {
    
    let allPoints = [...new Set([...pointsGroup1, ...pointsGroup2])];

    allPoints.sort((a, b) => a - b);

    const average1 = pointsGroup1.reduce((acc, val) => acc + val, 0) / pointsGroup1.length;
    const average2 = pointsGroup2.reduce((acc, val) => acc + val, 0) / pointsGroup2.length;

    let difference = average2 - average1;
    difference = ((difference % 1) + 1.5) % 1 - 0.5;

    return difference > 0
        ? {direction: 1, progress: difference} 
        : {direction: -1, progress: 1 - Math.abs(difference)} 
}