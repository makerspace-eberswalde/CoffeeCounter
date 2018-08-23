function timeDifference(current: any, previous: any) {

    const milliSecondsPerMinute = 60 * 1000
    const milliSecondsPerHour = milliSecondsPerMinute * 60
    const milliSecondsPerDay = milliSecondsPerHour * 24
    const milliSecondsPerMonth = milliSecondsPerDay * 30
    const milliSecondsPerYear = milliSecondsPerDay * 365

    const elapsed = current - previous

    if (elapsed < milliSecondsPerMinute / 3) {
        return 'just now'
    }

    if (elapsed < milliSecondsPerMinute) {
        return 'less than 1 min ago'
    } else if (elapsed < milliSecondsPerHour) {
        return Math.round(elapsed / milliSecondsPerMinute) + ' min ago'
    } else if (elapsed < milliSecondsPerDay ) {
        return Math.round(elapsed / milliSecondsPerHour ) + ' h ago'
    } else if (elapsed < milliSecondsPerMonth) {
        return Math.round(elapsed / milliSecondsPerDay) + ' days ago'
    } else if (elapsed < milliSecondsPerYear) {
        return Math.round(elapsed / milliSecondsPerMonth) + ' mo ago'
    } else {
        return Math.round(elapsed / milliSecondsPerYear ) + ' years ago'
    }
}

export function timeDifferenceForDate(date: any) {
    const now = new Date().getTime()
    const updated = new Date(date).getTime()
    return timeDifference(now, updated)
}

export async function ip_local() {
    var ip: any = false;
    window.RTCPeerConnection =
        window.RTCPeerConnection 
        || (window as any).mozRTCPeerConnection 
        || (window as any).webkitRTCPeerConnection 
        || false;

    if (window.RTCPeerConnection) {
        ip = [];
        var pc = await new RTCPeerConnection({iceServers: [] }), noop = function() {};
        await pc.createDataChannel('');
        await pc.createOffer(pc.setLocalDescription.bind(pc), noop);

        pc.onicecandidate = await function(event: any) {
            if (event && event.candidate && event.candidate.candidate) {
                var s = event.candidate.candidate.split('\n');
                ip.push(s[0].split(' ')[4]);
            }
        }
    }
    console.log(ip);
    return ip;
}
