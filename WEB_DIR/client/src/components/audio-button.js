import { useState, useEffect } from 'react';

export const AudioButton = ({audio}) =>  {
    const [playing, setPlayingV] = useState(false);
    const [song] = useState(new Audio(audio))

    const setPlaying = () => {
        if(playing){
            song.pause()
        } else {
            song.play();
        }
        setPlayingV(!playing)
    }

    useEffect(() => {
        song.addEventListener('ended', () => setPlayingV(false));
        return () => {
          song.removeEventListener('ended', () => setPlayingV(false));
        };
      }, []);

    return(
        <a onClick={(() => setPlaying())}>
            {playing ? (
                <svg className="h-6 w-6 fill-emerald-400" viewBox="0 0 60 60">
                <polygon points="0,0 15,0 15,60 0,60" />
                <polygon points="25,0 40,0 40,60 25,60" />
                </svg>
            ) : (
                <svg className="h-6 w-6 fill-emerald-400" viewBox="0 0 60 60">
                <polygon points="0,0 50,30 0,60" />
                </svg>
            )}
        </a>
    )
}

export default AudioButton