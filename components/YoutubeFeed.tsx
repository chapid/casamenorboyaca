export default function YouTubeFeed() {
    return (
        <div className="flex justify-center sm:border-4 border-black rounded-lg sm:p-2 background-black">
            <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/XUZaVAvSJYc?si=PkQ9oLn2ulcElTvn"
                title="YouTube Playlist"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
        </div>
    );
}


