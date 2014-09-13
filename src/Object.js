Object.clone = function (o) {
    if (o === null || typeof(o) !== 'object') return o;

    var objNew = o.constructor();

    for (var key in o)
        objNew[key] = Object.clone(o[key]);

    return objNew;
};
Object.merge = function (o1, o2) {
    var objNew = Object.clone(o1);
    for (var p in o2) {
        if (o2[p] && o2[p].constructor === Object) {
            if (!o1[p]) o1[p] = {};
            objNew[p] = Object.merge(o1[p], o2[p]);
        } else {
            objNew[p] = o2[p];
        }
    }
    return objNew;
};
