export function formatTime(t) {
    let d = new Date(t);
    let yyyy = d.getFullYear().toString();
    let mth = (d.getMonth() + 1).toString();
    if (mth.length < 2) { mth = '0' + mth; }
    let dd = d.getDate().toString();
    if (dd.length < 2) { dd = '0' + dd; }
    let h = d.getHours();
    let ampm = ' AM';
    if (h > 12) {
        h = h - 12;
        ampm = ' PM';
    }
    let hh = h.toString();
    if (h < 10) { hh = '0' + hh; }
    let m = d.getMinutes();
    let mm = m.toString();
    if (m < 10) { mm = '0' + mm; }
    let s = d.getSeconds();
    let ss = s.toString();
    if (s < 10) { ss = '0' + ss; }
    let f = `${yyyy}-${mth}-${dd} @${hh}:${mm}:${ss} ${ampm}`;
    return f;
}
