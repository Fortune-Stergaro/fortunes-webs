
export const logTimeDifference = (lastActive: string, threshold: string) => {
    const activeTime = new Date(lastActive).getTime();
    const thresholdTime = new Date(threshold).getTime();

    // Calculate difference in milliseconds
    const diffInMs = activeTime - thresholdTime;

    // Convert to seconds
    let diffInSeconds = diffInMs / 1000;
    diffInSeconds = 60 - diffInSeconds;

    // console.log(`------------------------------------------------`);
    // console.log(`Last Active: ${lastActive}`);
    // console.log(`Threshold:   ${threshold}`);
    // console.log(`Difference:  ${diffInSeconds.toFixed(2)} seconds`);

    // if (diffInSeconds > 0) {
    //     console.log(`STATUS: ✅ VISIBLE (User is safe by ${diffInSeconds}s)`);
    // } else {
    //     console.log(`STATUS: ❌ HIDDEN (User expired ${Math.abs(diffInSeconds)}s ago)`);
    // }
    // console.log(`------------------------------------------------`);
    diffInSeconds = diffInSeconds < 0 ? 99999 : diffInSeconds
    console.log("last ping: ", diffInSeconds, 's ago');
    return diffInSeconds;
}