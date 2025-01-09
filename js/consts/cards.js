const cards = {
    standard: {
        common: {
            1: {
                name: "Extra Points",
                desc: "Gain {+0} more points per draw.",
                levelCost: (x) => 20 * 1.2 ** x,
                starCost: (x) => (20 + 5 * x) * x ** x,
                effect: (level, star) => [
                    level * star,
                ],
                effector: {
                    pointsPerDraw: [priority.additive, (x) => x + fx(0)]
                }
            }
        }
    }
}