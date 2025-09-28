import React, { useState, useEffect, useRef } from "react";
import Panel from "../components/Panel";
import ButtonLink from "../components/ButtonLink";
import ModalManager from "../components/ModalManager";
import Input from "../components/Input";
import Textarea from "../components/Textarea";
import Select from "../components/Select";
import NumberInput from "../components/NumberInput";
import Label from "../components/Label";

import { Trash2 } from "lucide-react";

export default function Dashboard() {
  const [mods, setMods] = useState([]);
  const modalManagrRef = useRef();

  const nameRef = useRef();
  const authorRef = useRef();
  const version1Ref = useRef();
  const version2Ref = useRef();
  const version3Ref = useRef();
  const factorioVersionRef = useRef();
  const descriptionRef = useRef();

  useEffect(() => {
    fetch(`${process.env.API_URL}/api/projects/list`)
      .then((res) => res.json())
      .then((data) => setMods(data || []))
      .catch((err) => console.error("Failed to fetch mods:", err));

    const params = new URLSearchParams(window.location.search);
    if (params.get("newproject") === "true") {
      handleNewProject();
    }
  }, []);

  const handleImageError = (e) => {
    e.target.src = `${process.env.API_URL}/asset/core/missing-thumbnail.png`;
  };

  const handleNewProject = () => {
    const wizard = modalManagrRef.current.addWizard({
      title: "Create New Project",
      steps: [
        {
          content: (
            <div className="flex flex-col gap-2">
              <div>
                <Label htmlFor={"newProj-name"}>Project Name:</Label>
                <Input
                  id="newProj-name"
                  ref={nameRef}
                  placeholder={"My cool mod"}
                />
              </div>
              <div>
                <Label htmlFor={"newProj-author"}>Author:</Label>
                <Input
                  id="newProj-author"
                  ref={authorRef}
                  placeholder={"MrModDev"}
                />
              </div>
              <div>
                <Label text={"Version: "} htmlFor={"newProj-version"}>
                  Version:
                </Label>
                <div className="flex gap-2 items-end" id="newProj-version">
                  <NumberInput
                    id="newProj-version1"
                    defaultValue={0}
                    ref={version1Ref}
                  />
                  <span>.</span>
                  <NumberInput
                    id="newProj-version2"
                    defaultValue={1}
                    ref={version2Ref}
                  />
                  <span>.</span>
                  <NumberInput
                    id="newProj-version3"
                    defaultValue={0}
                    ref={version3Ref}
                  />
                </div>
              </div>
              <div>
                <Label text={"Factorio version: "} htmlFor={"newProj-fversion"}>
                  Factorio version:
                </Label>
                <Select
                  id="newProj-fversion"
                  ref={factorioVersionRef}
                  options={[{ name: "2.0.*", value: "2.0" }]}
                />
              </div>
            </div>
          ),
        },
        {
          content: (
            <div className="flex flex-col gap-2">
              <Label htmlFor={"newProj-description"}>
                Description (Optional):
              </Label>
              <Textarea id="newProj-description" ref={descriptionRef} />
            </div>
          ),
        },
      ],
      onFinish: () => {
        const projectData = {
          name: nameRef.current.value,
          author: authorRef.current.value,
          version: `${version1Ref.current.value}.${version2Ref.current.value}.${version3Ref.current.value}`,
          factorioVersion: factorioVersionRef.current.value,
          description: descriptionRef.current.value,
        };

        if (!projectData.name) {
          wizard.setModalStep(0);
          wizard.showError("Please enter a -name- for your project.");
          return;
        }
        if (!projectData.author) {
          wizard.setModalStep(0);
          wizard.showError("Please enter an -author- for your project.");
          return;
        }
        if (!projectData.version) {
          wizard.setModalStep(0);
          wizard.showError("Please enter a -version- for your project.");
          return;
        }
        if (!projectData.factorioVersion) {
          wizard.setModalStep(0);
          wizard.showError(
            "Please select a -Factorio version- for your project."
          );
          return;
        }

        console.log("Collected project data:", projectData);
        // You can now send this object to your backend or do whatever you need
        fetch(`${process.env.API_URL}/api/projects/create`, {
          method: "POST", // Change method to POST
          headers: {
            "Content-Type": "application/json", // Ensure the content type is JSON
          },
          body: JSON.stringify(projectData),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              window.location.href = `/${data.id}`;
            } else {
              alert("Error creating project");
              console.log(data);
            }
          })
          .catch((err) => console.error("Failed to create project:", err));

        wizard.close();
      },
    });
  };

  const handleDeleteProject = (id, name) => {
    modalManagrRef.current.addConfirmModal({
      title: "Project Deletion",
      content: (
        <div className="flex flex-col gap-4 p-2">
          <h1 className="text-2xl text-red">
            Do you really want to delete "{name}"?
          </h1>
          <p className="text-xl">This is unreversable!</p>
        </div>
      ),
      onYes: () => {
        fetch(`${process.env.API_URL}/api/projects/${id}/delete`)
          .then((res) => res.text())
          .then((data) => {
            console.log(data);
            // Filter out the deleted project from the mods list
            setMods((prevMods) => prevMods.filter((mod) => mod.id !== id));
          })
          .catch((err) => console.error("Failed to delete project:", err));
      },
    });
  };

  return (
    <div>
      <ModalManager ref={modalManagrRef} />
      <Panel
        title={"Projects"}
        className={"min-h-screen"}
        content={
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Existing Projects */}
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
                  <ButtonLink
                    type="success"
                    size="sm"
                    className="w-full text-center"
                    href={`/${mod.id}`}
                  >
                    Open
                  </ButtonLink>
                </div>
              </div>
            ))}
            {/* New Project Card */}
            <div
              className="flex flex-col justify-between items-center p-0 border-none accentuated rounded-sm bg-gray-dark shadow-xl min-h-[24rem] group hover:bg-gray-medium transition-all duration-300"
              onClick={handleNewProject}
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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
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
