"use client";
import { Button } from "primereact/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { InputText } from "primereact/inputtext";
import { Accordion, AccordionTab } from "primereact/accordion";
import { useState, useMemo } from "react";
import { faqList } from "@/const/faq.const";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";

export default function FAQPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFAQs = useMemo(() => {
    if (!searchTerm) return faqList;

    const searchLower = searchTerm.toLowerCase();
    return faqList.filter(
      (faq) =>
        faq.question.toLowerCase().includes(searchLower) ||
        faq.answer.toLowerCase().includes(searchLower)
    );
  }, [searchTerm]);

  return (
    <div className="flex align-items-center justify-content-center min-h-screen">
      <div className="surface-card p-4 shadow-2 border-round w-full lg:w-6">
        <div className="flex flex-column align-items-center mb-4">
          <div className="flex align-items-center gap-2 mb-2">
            <Image
              src="/logo-medium.webp"
              alt="Logo Playgrounds"
              width={40}
              height={40}
              priority
              className="rounded-full"
            />
            <span className="text-600 text-3xl font-bold">Playgrounds</span>
          </div>
          <h5 className="text-center text-3xl font-medium text-900 mt-2 mb-2">
            Preguntas Frecuentes
          </h5>
        </div>

        <div className="mb-4">
          <IconField iconPosition="left">
            <InputIcon className="pi pi-search"> </InputIcon>
            <InputText
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar pregutas..."
              className="w-full"
            />
          </IconField>
        </div>

        <div className="mb-4">
          {filteredFAQs.length > 0 ? (
            <Accordion>
              {filteredFAQs.map((faq, index) => (
                <AccordionTab
                  key={index}
                  header={faq.question}
                  className="text-lg"
                >
                  <p className="text-900">{faq.answer}</p>
                </AccordionTab>
              ))}
            </Accordion>
          ) : (
            <div className="text-center text-600">
              No se encontraron preguntas que coincidan con tu búsqueda.
            </div>
          )}
        </div>

        <div className="flex justify-content-center">
          <Button
            label="Volver"
            icon="pi pi-arrow-left"
            onClick={() => router.back()}
            className="p-button-secondary"
          />
        </div>
      </div>
    </div>
  );
}
