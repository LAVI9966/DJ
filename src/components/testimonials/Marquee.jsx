import { useContext, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Marquee from "../ui/marquee";
import myContext from "../../context/data/myContext";

const reviews = [
    {
        name: "MC Spark",
        username: "@mc_spark",
        body: "This drill beat is relentless! The tight 808s and dark melody make it impossible not to vibe with.",
        img: "https://images.unsplash.com/photo-1497562187797-ec8cb333f512?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Dk",
    },
    {
        name: "SHARV",
        username: "@sharv",
        body: "Incredible use of Indian samples, giving it a unique and standout quality that's bound to turn heads.",
        img: "https://scontent.fidr4-1.fna.fbcdn.net/v/t39.30808-6/337285883_2800784186741452_8445561761775530984_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=Fx4_WydQRHYQ7kNvgErMR7Z&_nc_zt=23&_nc_ht=scontent.fidr4-1.fna&_nc_gid=Ag3dPhcRC5lyIcwokaNXMin&oh=00_AYCMYQOxPZ8rN4j8da9gGB27wzOUKQpAsLn-lATEfF7-Ww&oe=67240FD7",
    },
    {
        name: "Cursed Kid",
        username: "@cursed_kid",
        body: "The beats were top-notch it truly elevated my music to a whole new level.",
        img: "https://images.unsplash.com/photo-1415886541506-6efc5e4b1786?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        name: "RhyThm X",
        username: "@rhythm_x",
        body: "Each beat was a masterpiece that perfectly complemented my vocal style.",
        img: "https://scontent.fidr4-1.fna.fbcdn.net/v/t39.30808-6/448763466_1004288424553864_6038661064834208573_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=hWbBfmrlslQQ7kNvgGyHAG-&_nc_zt=23&_nc_ht=scontent.fidr4-1.fna&_nc_gid=Ap0ZF55AEUjfM_-lQJeiVhI&oh=00_AYB4OuOKAnx5tlWLCy-GUHo252R26B1LoJLBdgq9P7Nveg&oe=67240FEE",
    },
    {
        name: "Dilshan",
        username: "@dilshan",
        body: "Absolutely loved working with DURSH! The quality and creativity of his beats are unmatched.",
        img: "https://images.unsplash.com/photo-1527630941-4a229fd674ab?q=80&w=353&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
];

const ReviewCard = ({ img, name, username, body }) => {
    return (
        <figure
            className={cn(
                "relative w-64 md:w-72 lg:w-80 cursor-pointer overflow-hidden rounded-xl border p-4 mx-2",
                // light styles
                "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
                // dark styles
                "dark:border-gray-800 dark:bg-black dark:hover:bg-gray-900"
            )}
        >
            <div className="flex flex-row items-center gap-2">
                <img className="rounded-full" width="32" height="32" alt="" src={img} />
                <div className="flex flex-col">
                    <figcaption className="text-sm font-medium text-black dark:text-white">{name}</figcaption>
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-400">{username}</p>
                </div>
            </div>
            <blockquote className="mt-2 text-sm text-black dark:text-gray-200">{body}</blockquote>
        </figure>
    );
};

export function MarqueeDemo() {
    const { mode } = useContext(myContext);
    const [darkMode, setDarkMode] = useState(mode);

    useEffect(() => {
        // Set the dark mode based on context
        const isDarkMode = mode === 'dark';
        setDarkMode(isDarkMode);

        // Update document class
        document.documentElement.classList.toggle("dark", isDarkMode);

        // Save preference in local storage
        localStorage.setItem("darkMode", isDarkMode);
    }, [mode]);

    return (
        <div className="relative h-96 flex flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl">
            <Marquee pauseOnHover className="[--duration:20s]">
                {reviews.map((review) => (
                    <ReviewCard key={review.username} {...review} />
                ))}
            </Marquee>

            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-black"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-black"></div>
        </div>
    );
}
