let wakeLock = null;

export async function requestWakeLock() {
    try {
        wakeLock = await navigator.wakeLock.request('screen');
        console.log('Screen will stay awake ✨');

        wakeLock.addEventListener('release', () => {
            console.log('Wake lock released');
        });
    } catch (err) {
        console.error(err);
    }
}