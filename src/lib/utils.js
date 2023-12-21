/** @param {SVGEllipseElement | undefined} ellipse */
export const getEllipseLength = (ellipse) => {
    if (!ellipse) return 0;
    let rx = parseInt(`${ellipse.getAttribute('rx')}`);
    let ry = parseInt(`${ellipse.getAttribute('ry')}`);
    let h = Math.pow((rx-ry), 2) / Math.pow((rx+ry), 2);
    let totalLength = (Math.PI * ( rx + ry )) * (1 + ( (3 * h) / ( 10 + Math.sqrt( 4 - (3 * h) )) ));
    return totalLength;
};