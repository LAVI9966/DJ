import { cn } from "@/lib/utils";
import AnimatedGrid from "../../components/ui/animated-grid-pattern"; // Adjust the import path based on your setup
import Cart from "./Cart"; // Assuming this is your main content component

export function AnimatedGridDemo() {
    return (
        <div className="relative flex h-full w-full overflow-hidden rounded-lg border bg-background p-20 md:shadow-xl">
            {/* Animated Grid in the background */}
            <AnimatedGrid
                numSquares={30}  // Adjust the number of squares as needed
                maxOpacity={0.1} // Control opacity
                duration={3}     // Animation duration
                repeatDelay={1}  // Delay before repeating the animation

            />
        </div>
    );
}
