import {
  CustomSelect,
  SelectGroup,
  SelectOption,
} from "@/components/CustomSelect";
import useProjectInfo from "@/hooks/useProjectInfo";
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

function IconSelect({ value, onChange, ...props }) {
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

  const onChangeHandler = (val) => {
    console.log(val);
    onChange?.(val);
  };

  return (
    <CustomSelect
      value={value}
      onChange={onChangeHandler}
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
              value={icon}
              isActiveFunction={(selected) => {
                console.log("ACTIVE? ",selected.value, icon.value, selected.value === icon.value);
                return selected.value === icon.value;
              }}
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
