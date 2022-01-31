const APP_ID = 'fe814eabbcae4a1c8780f50c6f71c756'
const CHANNEL = 'main'
const TOKEN = '006fe814eabbcae4a1c8780f50c6f71c756IACVYji2nIKVNa8p/c9SW5DABeQ2LmwKwXGRRg97HXwL+2TNKL8AAAAAEAC7nPWLpCH5YQEAAQCkIflh'
let UID;
const client = AgoraRTC.createClient({mode: 'rtc', codec: 'vp8'})

let localTracks = []
let remoteUsers = {}
let joinAndDisplayLocalStream = async () => {
    client.on('user-published', () => {
        console.log('user has join our room!')
    })
    UID = await client.join(APP_ID, CHANNEL, TOKEN, null)
    localTracks = await AgoraRTC.createMicrophoneAndCameraTracks()

    let player = `<div class="video-container" id="user-container-${UID}">
                <div class="username-wrapper">
                    <span class="user-name">My Name</span>
                </div>
                <div class="video-player" id="user-${UID}">

                </div>
            </div>`
    document.getElementById('video-streams').insertAdjacentHTML('beforeend', player)
    localTracks[1].play(`user-${UID}`)
    await client.publish([localTracks[0], localTracks[1]])
}

let handleUserJoined = async (user, mediaType) => {
    remoteUsers[user.uid] = user
    await client.subscribe(user, mediaType)

    if (mediaType === 'video') {
        let player = document.getElementById(`user-container-${user.uid}`)
        if (player != null) {
            player.remove()
        }
        player = `<div class="video-container" id="user-container-${user.uid}">
                <div class="username-wrapper">
                    <span class="user-name">My Name</span>
                </div>
                <div class="video-player" id="user-${user.uid}">

                </div>
            </div>`
        document.getElementById('video-streams').insertAdjacentHTML('beforeend', player)
        user.videoTrack.play(`user-${user.uid}`)
    }

    if (mediaType === 'audio') {
        user.audioTrack.play()
    }
}

joinAndDisplayLocalStream()

