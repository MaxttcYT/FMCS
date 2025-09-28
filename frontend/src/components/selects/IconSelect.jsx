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

  useEffect(() => {
    setIsLoading(true);
    fetch(`${process.env.API_URL}/api/list_icons`)
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
      noSelectionLabel={
        isLoading ? "Loading..." : "Select..."
      }
    >
      <SelectGroup
        label="Base"
        icon={{
          url: `${process.env.API_URL}/icon/base/icons/iron-gear-wheel.png`,
        }}
      >
        {data.map((element, index, array) => {
          return (
            <SelectOption
              value={element.value}
              icon={{ url: `${process.env.API_URL}${element.path}` }}
            >
              {element.name}
            </SelectOption>
          );
        })}
      </SelectGroup>
    </CustomSelect>
  );
}

export default IconSelect;
