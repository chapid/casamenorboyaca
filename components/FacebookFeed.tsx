"use client";
import { useEffect } from "react";

interface FacebookFeedProps {
    pageUrl: string;
}

const FacebookFeed = ({ pageUrl }: FacebookFeedProps) => {
    useEffect(() => {
        const loadFbSdk = () => {
            if (document.getElementById("facebook-jssdk")) return;

            const script = document.createElement("script");
            script.id = "facebook-jssdk";
            script.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v17.0";
            script.async = true;
            script.defer = true;
            script.crossOrigin = "anonymous";
            document.body.appendChild(script);
        };

        loadFbSdk();
    }, []);

    return (
        <div className="facebook-feed-wrapper">
            <div className="facebook-feed-container">
                <div
                    className="fb-page"
                    data-href={pageUrl}
                    data-tabs="timeline"
                    data-width="500"
                    data-height="600"
                    data-small-header="true"
                    data-adapt-container-width="false"
                    data-hide-cover="true"
                    data-show-facepile="true"
                ></div>
            </div>
        </div>
    );
};

export default FacebookFeed;
