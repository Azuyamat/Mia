import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useConfig } from "@/contexts/ConfigContext.tsx";
import { useCallback, useEffect } from "react";

export default function useCurrentPath() {
    const { config } = useConfig();
    const search = useSearchParams();
    const path = search.get("path") || config.defaultDir || null;
    const pathname = usePathname();
    const router = useRouter();

    const setPath = useCallback(
        (path: string) => {
            const params = new URLSearchParams(search.toString());
            params.set("path", path);

            const url = `${pathname}?${params.toString()}`;
            router.push(url);
        },
        [pathname, router, search]
    );

    const goToParent = () => {
        if (!path) {
            return;
        }

        const newPath = path.split(/[\\\/]/);
        if (newPath.length <= 2) {
            return;
        }

        newPath.pop();
        setPath(newPath.join("\\"));
    };

    const goToDefaultDir = () => {
        if (!config.defaultDir) {
            return;
        }

        setPath(config.defaultDir);
    };

    useEffect(() => {
        const newPath = search.get("path") || config.defaultDir;
        if (newPath && newPath !== path) {
            setPath(newPath);
        }
    }, [config.defaultDir, path, search, setPath]);

    return { path, setPath, goToParent, goToDefaultDir };
}
