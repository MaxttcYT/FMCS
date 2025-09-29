import React, { useState, useEffect } from "react";
import Panel from "../components/Panel";
import ButtonLink from "../components/ButtonLink";
import { Wizard, WizardStep } from "../components/Wizard";
import Input from "../components/Input";
import Textarea from "../components/Textarea";
import Select from "../components/Select";
import NumberInput from "../components/NumberInput";
import Label from "../components/Label";
import { Trash2 } from "lucide-react";
import { CustomSelect, SelectOption } from "@/components/CustomSelect";

export default function Dashboard() {
  const [mods, setMods] = useState([]);

  // Wizard open state
  const [wizardOpen, setWizardOpen] = useState(false);

  // States for new project form
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [version1, setVersion1] = useState(0);
  const [version2, setVersion2] = useState(1);
  const [version3, setVersion3] = useState(0);
  const [factorioVersion, setFactorioVersion] = useState("2.0");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetch(`${process.env.API_URL}/api/projects/list`)
      .then((res) => res.json())
      .then((data) => setMods(data || []))
      .catch((err) => console.error("Failed to fetch mods:", err));

    const params = new URLSearchParams(window.location.search);
    if (params.get("newproject") === "true") setWizardOpen(true);
  }, []);

  const handleImageError = (e) => {
    e.target.src = `${process.env.API_URL}/asset/core/missing-thumbnail.png`;
  };

  const handleFinish = () => {
    if (!name) return alert("Please enter a project name.");
    if (!author) return alert("Please enter an author.");
    if (!factorioVersion) return alert("Please select a Factorio version.");

    const projectData = {
      name,
      author,
      version: `${version1}.${version2}.${version3}`,
      factorioVersion,
      description,
    };

    fetch(`${process.env.API_URL}/api/projects/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(projectData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) window.location.href = `/${data.id}`;
        else alert("Error creating project");
      })
      .catch((err) => console.error("Failed to create project:", err));

    setWizardOpen(false);
  };

  const handleDeleteProject = (id, name) => {
    if (!confirm(`Do you really want to delete "${name}"? This is irreversible!`))
      return;

    fetch(`${process.env.API_URL}/api/projects/${id}/delete`)
      .then((res) => res.text())
      .then(() => setMods((prev) => prev.filter((mod) => mod.id !== id)))
      .catch((err) => console.error("Failed to delete project:", err));
  };

  return (
    <div>
      {/* Wizard rendered in JSX */}
      <Wizard open={wizardOpen} setOpen={setWizardOpen} title="Create New Project" onFinish={handleFinish}>
        <WizardStep>
          <div className="flex flex-col gap-2">
            <div>
              <Label htmlFor="newProj-name">Project Name:</Label>
              <Input id="newProj-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="My cool mod" />
            </div>
            <div>
              <Label htmlFor="newProj-author">Author:</Label>
              <Input id="newProj-author" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="MrModDev" />
            </div>
            <div>
              <Label text="Version:" htmlFor="newProj-version" />
              <div className="flex gap-2 items-end" id="newProj-version">
                <NumberInput value={version1} onChange={setVersion1} />
                <span>.</span>
                <NumberInput value={version2} onChange={setVersion2} />
                <span>.</span>
                <NumberInput value={version3} onChange={setVersion3} />
              </div>
            </div>
            <div>
              <Label text="Factorio version:" htmlFor="newProj-fversion" />
                <CustomSelect id="newProj-fversion" value={factorioVersion} onChange={(value) => setFactorioVersion(value)} searchable={false}>
                  <SelectOption value={"2.0"}>2.0.*</SelectOption>
                </CustomSelect>
            </div>
          </div>
        </WizardStep>

        <WizardStep>
          <div className="flex flex-col gap-2">
            <Label htmlFor="newProj-description">Description (Optional):</Label>
            <Textarea id="newProj-description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
        </WizardStep>
      </Wizard>

      <Panel
        title="Projects"
        className="min-h-screen"
        content={
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {mods.map((mod, i) => (
              <div
                key={i}
                className="flex flex-col justify-between items-center p-0 border-none accentuated rounded-sm bg-gray-dark shadow-xl min-h-[24rem]"
              >
                <div className="flex flex-col items-center w-full px-4 pt-4 relative">
                  <span
                    className="text-red absolute right-4 rounded-lg p-1 hover:text-red/75 hover:bg-gray-medium"
                    onClick={() => handleDeleteProject(i, mod.title)}
                  >
                    <Trash2 />
                  </span>
                  <div className="text-xl text-dirty-white font-bold text-center break-words whitespace-normal w-full">
                    {mod.title}
                  </div>
                  <div className="text-white rounded-sm bg-gray-medium shadow-inner my-4 w-32 h-32 flex items-center justify-center">
                    <img
                      src={`${process.env.API_URL}/api/files/${mod.id}/thumbnail.png`}
                      alt="Project Thumbnail"
                      className="w-32 h-32 object-cover"
                      onError={handleImageError}
                    />
                  </div>
                </div>
                <div className="mx-4 mt-auto w-full">
                  <ButtonLink type="success" size="sm" className="w-full text-center" href={`/${mod.id}`}>
                    Open
                  </ButtonLink>
                </div>
              </div>
            ))}

            {/* New Project Card */}
            <div
              className="flex flex-col justify-between items-center p-0 border-none accentuated rounded-sm bg-gray-dark shadow-xl min-h-[24rem] group hover:bg-gray-medium transition-all duration-300"
              onClick={() => setWizardOpen(true)}
            >
              <div className="flex flex-col items-center w-full px-4 pt-4 h-full justify-center">
                <div className="text-xl text-dirty-white font-bold text-center mb-4">
                  Create New Project
                </div>
                <div className="rounded-full bg-gray-medium group-hover:bg-gray-dark w-24 h-24 flex items-center justify-center transition-all duration-300">
                  <svg
                    className="w-16 h-16 text-dirty-white opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
}
