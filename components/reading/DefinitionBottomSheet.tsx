import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useRef, useMemo, useCallback } from "react";

const bottomSheetRef = useRef<BottomSheet>(null);
const snapPoints = useMemo(() => ["85%"], []);

const handleSheetChanges = useCallback((index: number) => {
  if (index === -1) {
    // setDefinitionIsOpen(false);
  }
}, []);
