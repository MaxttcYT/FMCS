import {
  CustomSelect,
  SelectGroup,
  SelectOption,
} from "@/components/CustomSelect";
import useProjectInfo from "@/hooks/useProjectInfo";
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

function IconSelect({ ...props }) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const { projectId } = useParams();

  useEffect(() => {
    setIsLoading(true);
    fetch(`${process.env.API_URL}/api/list_icons/${projectId}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      })
      .catch(console.error)
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <CustomSelect
      onChange={(val) => console.log(val)}
      {...props}
      disabled={isLoading}
      noSelectionLabel={isLoading ? "Loading..." : "Select..."}
    >
      {data.map((group, index) => (
        <SelectGroup
          key={index}
          label={group.data.title}
          icon={{
            url: `${process.env.API_URL}${group.data.icon_url}`,
            width: 44,
          }}
        >
          {group.icons.map((icon, iconIndex) => (
            <SelectOption
              key={iconIndex}
              value={icon.value}
              icon={{ url: `${process.env.API_URL}${icon.url}` }}
            >
              {icon.name}
            </SelectOption>
          ))}
        </SelectGroup>
      ))}
    </CustomSelect>
  );
}

export default IconSelect;
