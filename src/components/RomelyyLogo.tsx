import { cn } from "@/lib/utils";
import * as React from "react";

const RomelyyLogo = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
        className={cn("text-primary", props.className)}
    >
        <g transform="translate(50,50) scale(0.9)">
            <path
                d="M 0 -45 L 12 -15 L 45 0 L 15 12 L 0 45 L -15 12 L -45 0 L -12 -15 Z"
                fill="currentColor"
                opacity="0.3"
            />
            <circle cx="0" cy="0" r="10" fill="currentColor" opacity="0.6" />
            <path
                d="M -25 25 L -35 35 M 25 25 L 35 35 M -25 -25 L -35 -35 M 25 -25 L 35 -35"
                stroke="hsl(var(--background))"
                strokeWidth="4"
                strokeLinecap="round"
            />
            <path
                d="M 20 0 H 35 M -20 0 H -35 M 0 20 V 35 M 0 -20 V -35"
                stroke="hsl(var(--background))"
                strokeWidth="4"
                strokeLinecap="round"
            />
            <path
                d="M -30 0 C -30 16.5, -16.5 30, 0 30 C 16.5 30, 30 16.5, 30 0"
                fill="none"
                stroke="hsl(var(--primary-foreground))"
                strokeWidth="7"
            />
             <path
                d="M 0 -5 L 0 -15"
                fill="none"
                stroke="hsl(var(--primary-foreground))"
                strokeWidth="7"
                strokeLinecap="round"
            />

        </g>
    </svg>
);

export default RomelyyLogo;
