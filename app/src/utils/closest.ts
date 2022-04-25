export function closest({ from, target }: { from: number[]; target: number }) {
    return from.reduce(
        (currentNode, value, idx) => {
            let { diff, index } = currentNode;

            const difference = Math.abs(value - target);
            if (difference < diff) {
                diff = difference;
                index = idx;
            }
            return { diff, index };
        },
        {
            diff: Infinity,
            index: -1,
        }
    );
}
