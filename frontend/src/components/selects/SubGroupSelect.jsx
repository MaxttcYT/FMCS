import {
  CustomSelect,
  SelectGroup,
  SelectOption,
} from "@/components/CustomSelect";
import React, { useState, useEffect, useRef } from "react";

function SubGroupSelect({ ...props }) {
  return (
    <CustomSelect onChange={(val) => console.log(val)} showGroupIconAsIcon={true} {...props}>
      <SelectGroup
        label="Logistics"
        icon={{
          url: `${process.env.API_URL}/icon/base/item-group/logistics.png?crop=128x128`,
        }}
      >
        <SelectOption value="logistics-storage">Storage</SelectOption>
        <SelectOption value="logistics-belt">Belt</SelectOption>
        <SelectOption value="logistics-inserter">Inserter</SelectOption>
        <SelectOption value="logistics-energy-pipe-distribution">
          Energy pipe distribution
        </SelectOption>
        <SelectOption value="logistics-train-transport">
          Train transport
        </SelectOption>
        <SelectOption value="logistics-transport">Transport</SelectOption>
        <SelectOption value="logistics-logistic-network">
          Logistic network
        </SelectOption>
        <SelectOption value="logistics-circuit-network">
          Circuit network
        </SelectOption>
        <SelectOption value="logistics-terrain">Terrain</SelectOption>
      </SelectGroup>
      <SelectGroup
        label="Production"
        icon={{
          url: `${process.env.API_URL}/icon/base/item-group/production.png?crop=128x128`,
        }}
      >
        <SelectOption value="production-tool">Tool</SelectOption>
        <SelectOption value="production-energy">Energy</SelectOption>
        <SelectOption value="production-extraction-machine">
          Extraction machine
        </SelectOption>
        <SelectOption value="production-smelting-machine">
          Smelting machine
        </SelectOption>
        <SelectOption value="production-production-machine">
          Production machine
        </SelectOption>
        <SelectOption value="production-module">Module</SelectOption>
        <SelectOption value="production-space-related">
          Space related
        </SelectOption>
      </SelectGroup>
      <SelectGroup
        label="Intermediate-products"
        icon={{
          url: `${process.env.API_URL}/icon/base/item-group/intermediate-products.png?crop=128x128`,
        }}
      >
        <SelectOption value="fluid-recipes">
          Fluid recipes
        </SelectOption>
        <SelectOption value="raw-resource">
          Raw resource
        </SelectOption>
        <SelectOption value="raw-material">
          Raw material
        </SelectOption>
        <SelectOption value="barrel">Barrel</SelectOption>
        <SelectOption value="fill-barrel">
          Fill barrel
        </SelectOption>
        <SelectOption value="empty-barrel">
          Empty barrel
        </SelectOption>
        <SelectOption value="intermediate-product">
          Intermediate product
        </SelectOption>
        <SelectOption value="intermediate-recipe">
          Intermediate recipe
        </SelectOption>
        <SelectOption value="uranium-processing">
          Uranium processing
        </SelectOption>
        <SelectOption value="science-pack">
          Science pack
        </SelectOption>
        <SelectOption value="internal-process">
          Internal process
        </SelectOption>
      </SelectGroup>
      <SelectGroup
        label="Combat"
        icon={{
          url: `${process.env.API_URL}/icon/base/item-group/military.png?crop=128x128`,
        }}
      >
        <SelectOption value="gun">Gun</SelectOption>
        <SelectOption value="ammo">Ammo</SelectOption>
        <SelectOption value="capsule">Capsule</SelectOption>
        <SelectOption value="armor">Armor</SelectOption>
        <SelectOption value="equipment">Equipment</SelectOption>
        <SelectOption value="utility-equipment">
          Utility equipment
        </SelectOption>
        <SelectOption value="military-equipment">
          Military equipment
        </SelectOption>
        <SelectOption value="defensive-structure">
          Defensive structure
        </SelectOption>
        <SelectOption value="turret">Turret</SelectOption>
        <SelectOption value="ammo-category">Ammo category</SelectOption>
      </SelectGroup>
      <SelectGroup
        label="Fluids"
        icon={{
          url: `${process.env.API_URL}/icon/base/item-group/fluids.png?crop=128x128`,
        }}
      >
        <SelectOption value="fluid">Fluid</SelectOption>
      </SelectGroup>
      <SelectGroup
        label="Signals"
        icon={{
          url: `${process.env.API_URL}/icon/base/item-group/signals.png?crop=128x128`,
        }}
      >
        <SelectOption value="virtual-signal-special">
          Virtual signal special
        </SelectOption>
        <SelectOption value="virtual-signal-number">
          Virtual signal number
        </SelectOption>
        <SelectOption value="virtual-signal-letter">
          Virtual signal letter
        </SelectOption>
        <SelectOption value="virtual-signal-punctuation">
          Virtual signal punctuation
        </SelectOption>
        <SelectOption value="virtual-signal-math">
          Virtual signal math
        </SelectOption>
        <SelectOption value="virtual-signal-color">
          Virtual signal color
        </SelectOption>
        <SelectOption value="virtual-signal">
          Virtual signal
        </SelectOption>
        <SelectOption value="shapes">Shapes</SelectOption>
        <SelectOption value="arrows">Arrows</SelectOption>
        <SelectOption value="arrows-misc">Arrows misc</SelectOption>
        <SelectOption value="pictographs">Pictographs</SelectOption>
        <SelectOption value="bullets">Bullets</SelectOption>
      </SelectGroup>
      <SelectGroup
        label="Enemies"
        icon={{
          url: `${process.env.API_URL}/icon/core/icons/category/enemies.png?crop=128x128`,
        }}
      >
        <SelectOption value="enemies">Enemies</SelectOption>
      </SelectGroup>
      <SelectGroup
        label="Environment"
        icon={{
          url: `${process.env.API_URL}/icon/core/icons/category/environment.png?crop=128x128`,
        }}
      >
        <SelectOption value="creatures">Creatures</SelectOption>
        <SelectOption value="cliffs">Cliffs</SelectOption>
        <SelectOption value="trees">Trees</SelectOption>
        <SelectOption value="grass">Grass</SelectOption>
        <SelectOption value="mineable-fluids">
          Mineable fluids
        </SelectOption>
        <SelectOption value="obstacles">Obstacles</SelectOption>
        <SelectOption value="corpses">Corpses</SelectOption>
        <SelectOption value="remnants">Remnants</SelectOption>
        <SelectOption value="storage-remnants">
          Storage remnants
        </SelectOption>
        <SelectOption value="belt-remnants">
          Belt remnants
        </SelectOption>
        <SelectOption value="inserter-remnants">
          Inserter remnants
        </SelectOption>
        <SelectOption value="energy-pipe-distribution-remnants">
          Energy pipe distribution remnants
        </SelectOption>
        <SelectOption value="train-transport-remnants">
          Train transport remnants
        </SelectOption>
        <SelectOption value="transport-remnants">
          Transport remnants
        </SelectOption>
        <SelectOption value="logistic-network-remnants">
          Logistic network remnants
        </SelectOption>
        <SelectOption value="circuit-network-remnants">
          Circuit network remnants
        </SelectOption>
        <SelectOption value="energy-remnants">
          Energy remnants
        </SelectOption>
        <SelectOption value="extraction-machine-remnants">
          Extraction machine remnants
        </SelectOption>
        <SelectOption value="smelting-machine-remnants">
          Smelting machine remnants
        </SelectOption>
        <SelectOption value="production-machine-remnants">
          Production machine remnants
        </SelectOption>
        <SelectOption value="defensive-structure-remnants">
          Defensive structure remnants
        </SelectOption>
        <SelectOption value="generic-remnants">
          Generic remnants
        </SelectOption>
        <SelectOption value="scorchmarks">Scorchmarks</SelectOption>
        <SelectOption value="wrecks">Wrecks</SelectOption>
      </SelectGroup>
      <SelectGroup
        label="Tiles"
        icon={{
          url: `${process.env.API_URL}/icon/core/icons/category/tiles-editor.png?crop=128x128`,
        }}
      >
        <SelectOption value="artificial-tiles">
          Artificial tiles
        </SelectOption>
        <SelectOption value="nauvis-tiles">Nauvis tiles</SelectOption>
        <SelectOption value="vulcanus-tiles">Vulcanus tiles</SelectOption>
        <SelectOption value="gleba-water-tiles">
          Gleba water tiles
        </SelectOption>
        <SelectOption value="gleba-tiles">Gleba tiles</SelectOption>
        <SelectOption value="fulgora-tiles">Fulgora tiles</SelectOption>
        <SelectOption value="aquilo-tiles">Aquilo tiles</SelectOption>
        <SelectOption value="special-tiles">Special tiles</SelectOption>
      </SelectGroup>
      <SelectGroup
        label="Effects"
        icon={{
          url: `${process.env.API_URL}/icon/base/item-group/effects.png?crop=128x128`,
        }}
      >
        <SelectOption value="storage-explosions">
          Storage explosions
        </SelectOption>
        <SelectOption value="belt-explosions">
          Belt explosions
        </SelectOption>
        <SelectOption value="inserter-explosions">
          Inserter explosions
        </SelectOption>
        <SelectOption value="energy-pipe-distribution-explosions">
          Energy pipe distribution explosions
        </SelectOption>
        <SelectOption value="train-transport-explosions">
          Train transport explosions
        </SelectOption>
        <SelectOption value="transport-explosions">
          Transport explosions
        </SelectOption>
        <SelectOption value="logistic-network-explosions">
          Logistic network explosions
        </SelectOption>
        <SelectOption value="circuit-network-explosions">
          Circuit network explosions
        </SelectOption>
        <SelectOption value="energy-explosions">
          Energy explosions
        </SelectOption>
        <SelectOption value="extraction-machine-explosions">
          Extraction machine explosions
        </SelectOption>
        <SelectOption value="smelting-machine-explosions">
          Smelting machine explosions
        </SelectOption>
        <SelectOption value="production-machine-explosions">
          Production machine explosions
        </SelectOption>
        <SelectOption value="module-explosions">
          Module explosions
        </SelectOption>
        <SelectOption value="campaign-explosions">
          Campaign explosions
        </SelectOption>
        <SelectOption value="gun-explosions">
          Gun explosions
        </SelectOption>
        <SelectOption value="defensive-structure-explosions">
          Defensive structure explosions
        </SelectOption>
        <SelectOption value="capsule-explosions">
          Capsule explosions
        </SelectOption>
        <SelectOption value="tree-explosions">
          Tree explosions
        </SelectOption>
        <SelectOption value="rock-explosions">
          Rock explosions
        </SelectOption>
        <SelectOption value="ground-explosions">
          Ground explosions
        </SelectOption>
        <SelectOption value="decorative-explosions">
          Decorative explosions
        </SelectOption>
        <SelectOption value="enemy-death-explosions">
          Enemy death explosions
        </SelectOption>
        <SelectOption value="fluid-explosions">
          Fluid explosions
        </SelectOption>
        <SelectOption value="explosions">Explosions</SelectOption>
        <SelectOption value="hit-effects">Hit effects</SelectOption>
        <SelectOption value="particles">Particles</SelectOption>
      </SelectGroup>
      <SelectGroup
        label="Other"
        icon={{
          url: `${process.env.API_URL}/icon/core/icons/category/unsorted.png?crop=128x128`,
        }}
      >
        <SelectOption value="parameters">Parameters</SelectOption>
        <SelectOption value="qualities">Qualities</SelectOption>
        <SelectOption value="spawnables">Spawnables</SelectOption>
        <SelectOption value="other">Other</SelectOption>
      </SelectGroup>
    </CustomSelect>
  );
}

export default SubGroupSelect;
