export const simpleRuleOfThree = ({
    given,
    equivalentTo,
    numberToCompute,
}: {
    given: number;
    equivalentTo: number;
    numberToCompute: number;
}) => {
    return (numberToCompute * equivalentTo) / given;
};
