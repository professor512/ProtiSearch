import { useEffect, useRef } from "react";
import { Viewer } from "molstar/lib/apps/viewer/app";

import "molstar/build/viewer/molstar.css";

function ProteinViewer({ pdbId }) {
    const viewerRef = useRef(null);

    useEffect(() => {
        let viewer;

        const initViewer = async () => {
            if (!viewerRef.current) return;

            viewer = await Viewer.create(viewerRef.current, {
                layoutIsExpanded: false,
                layoutShowControls: true,
                layoutShowRemoteState: false,
                layoutShowSequence: true,
                layoutShowLog: false,
                layoutShowLeftPanel: true,
                collapseLeftPanel: false,
                collapseRightPanel: true,
            });

            if (pdbId) {
                await viewer.loadPdb(pdbId);
            }
        };

        initViewer();

        return () => {
            if (viewer) {
                viewer.plugin.dispose();
            }
        };
    }, [pdbId]);

    return (
        <div
            ref={viewerRef}
            style={{
                width: "100%",
                height: "600px",
                position: "relative",
            }}
        />
    );
}

export default ProteinViewer;