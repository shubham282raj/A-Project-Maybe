import React, { useState } from "react";
import { useQuery } from "react-query";
import { getContent } from "../api/github";
import FileFolder from "../components/FileFolder";

export default function Browse() {
  const [path, setPath] = useState("");

  const [selected, setSelected] = useState([]);

  const { data, isLoading, error } = useQuery({
    queryFn: () => getContent(path || ""),
    queryKey: `content-${path}`,
    onSuccess(data) {
      return data.sort((a, b) => {
        if (a.type === b.type) return 0;
        return a.type === "file" ? 1 : -1;
      });
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <div className="mb-3 flex justify-between rounded-lg bg-gray-800 px-3 py-2">
        <div className="flex">
          <button
            className="mr-2 flex aspect-square items-center justify-center rounded-lg border bg-slate-900 disabled:bg-slate-800 disabled:opacity-50"
            disabled={path == ""}
            onClick={() => {
              setPath((path) => path.substring(0, path.lastIndexOf("/")));
            }}
          >
            <img
              src="icons/uparrow.svg"
              alt="go_back"
              className="h-3/4 invert"
            />
          </button>
          <div className="flex gap-2">
            <div className="font-bold">Current Path:</div>
            <div>{path == "" ? "Root" : path}</div>
          </div>
        </div>
        {selected.length != 0 && (
          <div className="flex">
            <div>{selected.length} Selected</div>
            <button className="flex aspect-square h-6 flex-col justify-evenly">
              <div className="ml-auto mr-1.5 aspect-square w-1 rounded-full bg-white"></div>
              <div className="ml-auto mr-1.5 aspect-square w-1 rounded-full bg-white"></div>
              <div className="ml-auto mr-1.5 aspect-square w-1 rounded-full bg-white"></div>
            </button>
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-3">
        {data.map((value, index) => (
          <FileFolder
            key={`file-folder-${value.html_url}`}
            data={value}
            selected={selected}
            setSelected={setSelected}
            setPath={setPath}
          />
        ))}
      </div>
      <div>{JSON.stringify(selected)}</div>
    </div>
  );
}