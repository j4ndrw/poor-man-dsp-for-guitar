import type { KnobName } from "@/types/AmpSettings";

export interface KnobBaseProps {
    disabled?: boolean;
    name: KnobName;
}
