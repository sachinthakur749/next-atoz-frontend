interface StepperProps {
    steps: Step[];
}

export default function Stepper({ steps }: StepperProps) {
    return (
        <div className="w-full">
            <div className="relative flex w-full justify-between">
                <div
                    className="absolute bottom-[10px] h-[2px] bg-gray-200"
                    style={{
                        left: "calc(2rem - 1px)",
                        right: "calc(2rem - 1px)",
                    }}
                >
                    <div
                        className="h-full bg-primaryOrange transition-all duration-300"
                        style={{
                            width: `${(steps.filter((step) => step.status === "complete").length /
                                (steps.length - 1)) *
                                100
                                }%`,
                        }}
                    />
                </div>

                {steps.map((step) => (
                    <div
                        key={step.id}
                        className="relative flex flex-col items-center gap-2"
                        style={{ width: "4rem" }}
                    >
                        <span
                            className={`${step.status === "current"
                                ? "text-primary"
                                : step.status === "complete"
                                    ? "text-foreground"
                                    : "text-gray-400"
                                } text-center text-nowrap text-sm font-medium`}
                        >
                            {step.title}
                        </span>
                        <div
                            className={`${step.status === "current"
                                ? "border-primaryOrange bg-white"
                                : step.status === "complete"
                                    ? "border-primaryOrange bg-primaryOrange"
                                    : "border-gray-300 bg-white"
                                } relative z-10 flex h-[20px] w-[20px] items-center justify-center rounded-full border-2 transition-colors`}
                        >
                            <span
                                className={`${step.status === "current"
                                    ? "bg-primary"
                                    : step.status === "upcoming"
                                        ? "bg-gray-300"
                                        : ""
                                    } h-2 w-2 rounded-full`}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
