import React, { useEffect, useRef, useState } from "react";

const MusicVisualizer = ({ audioUrl, imageUrl }) => {
    const audioRef = useRef(null);
    const canvasRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioContext, setAudioContext] = useState(null);

    useEffect(() => {
        if (isPlaying && !audioContext) {
            const context = new (window.AudioContext || window.webkitAudioContext)();
            const analyser = context.createAnalyser();
            const audio = audioRef.current;
            const source = context.createMediaElementSource(audio);
            source.connect(analyser);
            analyser.connect(context.destination);
            setAudioContext(context);
            visualize(analyser);
        }
    }, [isPlaying]);

    const visualize = (analyser) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            analyser.getByteFrequencyData(dataArray);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width / bufferLength) * 2.5;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                const barHeight = dataArray[i] / 2;
                const r = (barHeight + 100) % 256;
                const g = (i * 5) % 256;
                const b = 55;

                ctx.fillStyle = `rgb(${r},${g},${b})`;
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                x += barWidth + 1;
            }

            requestAnimationFrame(draw);
        };

        draw();
    };

    const handlePlayPause = () => {
        const audio = audioRef.current;
        if (isPlaying) audio.pause();
        else audio.play();
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="mx-6 p-6 sm:mx-4 sm:p-4 md:mx-6 md:p-6">
            <div className="flex flex-col lg:flex-row items-center justify-center gap-8 mx-6 p-6 sm:mx-2 sm:p-2 md:mx-6 md:p-6">
                {/* Image Section */}
                <img
                    src={imageUrl}
                    alt="Visualizer Thumbnail"
                    className="w-full max-w-sm rounded-lg object-cover shadow-lg lg:w-1/3"
                />

                {/* Visualizer Section */}
                <div className="w-full lg:w-2/3 flex flex-col items-center">
                    <canvas
                        ref={canvasRef}
                        width={800}
                        height={120}
                        className="w-full max-w-full overflow-hidden"
                    />
                    <audio ref={audioRef} src={audioUrl} />

                    {/* Play / Pause Button */}
                    <button
                        onClick={handlePlayPause}
                        className={`mt-4 px-6 py-2 rounded-lg text-white ${isPlaying ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
                            }`}
                    >
                        {isPlaying ? "Pause" : "Play"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MusicVisualizer;
