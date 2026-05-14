import { useState, useEffect, useRef, type ChangeEvent, type FormEvent } from "react";
import { FormFiled } from "../../../../Components/Common/FormFiled";
import { FaPlus, FaShieldAlt, FaTrash } from "react-icons/fa";
import TailwindToggle from "../../../../Components/Common/Toggle";
import type { InsuranceTypes } from "../../../../Types/typesOnboarding";
import { Checkbox } from "../../../../Components/Common/CheckBox";
import { Selection } from "../../../../Components/Common/Selection";

type EmployeeRegisterProps = {
  empId?: string;
  initialData?: InsuranceTypes | null;
  ClicktoAction?: () => void;
  salaryData?: any;
  EmployeeD?: any;
  setInsPFdata?: (data: any) => void;
};


const AnimSection = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number; }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: triggered ? 1 : 0,
        transform: triggered ? "translateY(0px) scale(1)" : "translateY(22px) scale(0.985)",
        transition: triggered
          ? `opacity 0.55s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.55s cubic-bezier(0.22,1,0.36,1) ${delay}ms`
          : "none",
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
};

/* ─── Nominee row — slides + fades in when added ──────────────────────────── */
const NomineeRow = ({ children, isNew }: { children: React.ReactNode; isNew?: boolean; }) => {
  const [mounted, setMounted] = useState(!isNew);
  useEffect(() => {
    if (isNew) {
      const raf = requestAnimationFrame(() => setMounted(true));
      return () => cancelAnimationFrame(raf);
    }
  }, [isNew]);

  return (
    <div
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0px)" : "translateY(14px)",
        transition: "opacity 0.38s cubic-bezier(0.22,1,0.36,1), transform 0.38s cubic-bezier(0.22,1,0.36,1)",
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
};

/* ─── Static data ─────────────────────────────────────────────────────────── */
const InsuProvider = [
  { value: "Tata", label: "Tata" },
  { value: "MuthuFIN", label: "MuthuFIN" },
  { value: "Bajaj", label: "Bajaj" },
];

const DEFAULT_FORM: InsuranceTypes = {
  uan_number: "",
  pf_id: "",
  insurance_no: "",
  aadhar_no: "",
  esi_no: "",
  esi_name: "",
  insurance_provider: "",
  Nominee: [{ nominee_name: "", nominee_aadhar: "" }],
  apply_esi: ""
};

/* ─── Main component ──────────────────────────────────────────────────────── */
export const Insurance = ({
  
  ClicktoAction,
  setInsPFdata,
  initialData,
  salaryData,
  EmployeeD,
}: EmployeeRegisterProps) => {
  const [INSFD, setINSFD] = useState<InsuranceTypes>(() => initialData ?? DEFAULT_FORM);
  const [hasUAN, setHasUAN] = useState(false);
  const [hasINS, sethasINS] = useState(false);
  const [hasESI, sethasESI] = useState(false);
  const [checkESI, setcheckESI] = useState(false);
  const [ESIdis, setESIdis] = useState(false);
  const [newNomineeIndices, setNewNomineeIndices] = useState<Set<number>>(new Set());

  const annualSalary = parseFloat(salaryData?.annualSalary) || 0;
  const month_salary = annualSalary / 12;

  useEffect(() => {
    if (month_salary > 0 && month_salary < 21000) {
      setESIdis(false);
    } else {
      setESIdis(true);
      sethasESI(false);
    }
  }, [month_salary]);

  const nomineeOptions = (EmployeeD?.Familys || []).map((member: any) => ({
    label: member.person_name || "Unnamed Member",
    value: member.person_name || "",
  }));

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setINSFD((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleNomineeChange = (index: number, field: string, value: string) => {
    const updatedNominees = [...(INSFD.Nominee || [])];
    updatedNominees[index] = { ...updatedNominees[index], [field]: value };
    setINSFD({ ...INSFD, Nominee: updatedNominees });
  };

  const addNomineeSection = () => {
    const nextIndex = (INSFD.Nominee || []).length;
    setNewNomineeIndices((prev) => new Set(prev).add(nextIndex));
    setINSFD({
      ...INSFD,
      Nominee: [...(INSFD.Nominee || []), { nominee_name: "", nominee_aadhar: "" }],
    });
  };

  const removeNomineeSection = (index: number) => {
    if (INSFD.Nominee.length > 1) {
      const updated = INSFD.Nominee.filter((_: any, i: number) => i !== index);
      setINSFD({ ...INSFD, Nominee: updated });
    }
  };


  //  onSubmit

const onSubmit = (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  // This ensures every single field is at least an empty string, never null
  const payload = {
    uan_number: INSFD.uan_number || "",
    pf_id: INSFD.pf_id || "",
    insurance_no: INSFD.insurance_no || "",
    aadhar_no: INSFD.aadhar_no || "",
    esi_no: INSFD.esi_no || "",
    esi_name: INSFD.esi_name || "",
    insurance_provider: INSFD.insurance_provider || "",
    apply_esi: checkESI ? "New registration apply" : "", // Force string
    Nominee: INSFD.Nominee.map(n => ({
        nominee_name: n.nominee_name || "",
        nominee_aadhar: n.nominee_aadhar || ""
    }))
  };

  console.log("Payload being sent:", payload); // Check your browser console!
  setInsPFdata?.(payload);
  ClicktoAction?.();
};



  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
        .emp-page { font-family: 'DM Sans', sans-serif; padding: 24px; }
        @keyframes shieldFloat {
          0%   { transform: translateY(0px) rotate(-4deg); opacity: 0; }
          100% { transform: translateY(0px) rotate(0deg); opacity: 1; }
        }
        .shield-icon { animation: shieldFloat 0.65s cubic-bezier(0.22,1,0.36,1) both; }
        .emp-heading { font-size: 28px; font-weight: 700; color: hsl(var(--text-hsl)); }
        .emp-section-head {
          font-size: 15px; font-weight: 600; color: hsl(var(--primary-hsl));
          margin-bottom: 12px; padding-bottom: 10px;
          border-bottom: 1.5px solid #e2e8f0;
          display: flex; align-items: center; justify-content: space-between;
        }
        .emp-row-card {
          position: relative; margin-bottom: 16px; padding: 18px;
          border: 1.5px solid #e2e8f0; border-radius: 12px;
          background: #fff;
          transition: box-shadow 0.25s ease, transform 0.25s ease;
        }
        .emp-row-card:hover { border-color: hsl(var(--primary-hsl) / 0.3); box-shadow: 0 6px 22px hsl(var(--primary-hsl) / 0.1); }
        .emp-add-btn {
          display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: hsl(var(--primary-hsl));
          background: transparent; border: none; cursor: pointer; padding: 4px 10px; border-radius: 8px;
        }
        .emp-remove-btn {
          display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; 
          border-radius: 8px; border: none; background: transparent; cursor: pointer; color: #94a3b8;
        }
        .emp-remove-btn:hover { background: #fee2e2; color: #ef4444; }
        .emp-submit-btn {
          background: hsl(var(--primary-hsl)); color: #fff; padding: 12px 40px; border-radius: 10px;
          font-size: 15px; font-weight: 600; border: none; cursor: pointer;
          box-shadow: 0 4px 14px hsl(var(--primary-hsl) / 0.35);
        }
        .emp-submit-btn:hover { opacity: 0.9; box-shadow: 0 6px 20px hsl(var(--primary-hsl) / 0.45); }
        .not-eligible-badge {
          padding: 4px 8px; font-size: 10px; font-weight: 700;
          color: #dc2626; background: #fef2f2; border-radius: 6px; border: 1px solid #fecaca;
        }
      `}</style>

      <div className="emp-page h-full overflow-auto">
        <AnimSection delay={0}>
          <div className="flex items-center gap-3 mb-8">
            <FaShieldAlt className="shield-icon text-[26px] text-primary shrink-0" />
            <h1 className="emp-heading">Insurance & Provident Fund</h1>
          </div>
        </AnimSection>

        <form className="space-y-6" onSubmit={onSubmit}>
          {/* PROVIDENT FUND */}
          <AnimSection delay={80}>
            <section className="bg-white p-2 rounded-xl">
              <div className="emp-section-head">PROVIDENT FUND</div>
              <TailwindToggle
                label="If you already have a UAN"
                initialState={hasUAN}
                onToggle={(val: boolean) => setHasUAN(val)}
              />
              {hasUAN && (<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormFiled name="uan_number" value={INSFD.uan_number} Lable="UAN Number" in_PlaceHolder="Enter 12-digit UAN" onChange={onChange} />
                  <FormFiled name="pf_id" value={INSFD.pf_id} Lable="PF Member ID" in_PlaceHolder="Enter PF Member ID" onChange={onChange} />
                </div>)||
                (
                <FormFiled name="aadhar_no" in_PlaceHolder="XXXX-XXXX-1234" value={INSFD.aadhar_no || ""} onChange={onChange} Lable="Aadhar Number (for new PF)" />
              )
              }
            </section>
          </AnimSection>

          {/* ESI */}
          <AnimSection delay={160}>
            
              <section className={`bg-white p-2 rounded-xl`}>
              <div className="emp-section-head">
                <span>ESI (Employee State Insurance)</span>
                {ESIdis && <span className="not-eligible-badge">Not eligible {month_salary}</span>}
              </div>

              {!ESIdis && (
                <>
                  <TailwindToggle
                    label="Already have an ESI Number?"
                    initialState={hasESI}
                    onToggle={(val: boolean) => sethasESI(val)}
                  />
                  {hasESI && (<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormFiled name="esi_no" value={INSFD.esi_no || ""} Lable="ESI Number" in_PlaceHolder="Enter ESI Number" onChange={onChange} />
                      <FormFiled name="esi_name" value={INSFD.esi_name || ""} Lable="Name in ESI" in_PlaceHolder="Name as per ESI records" onChange={onChange} />
                    </div>)||(
                  <Checkbox 
                    checked={checkESI} 
                    label="Apply for new ESI Registration" 
                    onChange={(val: boolean) => {
                    setcheckESI(val);
                    setINSFD(prev => ({ ...prev, apply_esi: val ? "New registration apply" : "" }));
                      }} 
                    name="apply_esi" 
                  />
                       )}
                </>
              )}
            </section>

            
          </AnimSection>

          {/* INSURANCE */}
          <AnimSection delay={240}>
            <section className="bg-white p-2 rounded-xl">
              <div className="emp-section-head">INSURANCE DETAILS</div>
              <TailwindToggle
                label="Existing Corporate/Private Insurance?"
                initialState={hasINS}
                onToggle={(val: boolean) => sethasINS(val)}
              />
              {hasINS&&( 
                <FormFiled name="insurance_no" value={INSFD.insurance_no} Lable="Policy Number" in_PlaceHolder="Enter Policy ID" onChange={onChange} />
                )||(
                    <Selection label="Select Provider" 
                    name="insurance_provider" 
                    value={INSFD.insurance_provider || ""} 
                    options={InsuProvider} onChange={onChange} />
                )}
            </section>
          </AnimSection>

          {/* NOMINEES (Only shows if Insurance toggle is ON) */}

          {!hasINS&&(
                        <AnimSection delay={0}>
              <section className="bg-white p-2 rounded-xl">
                <div className="emp-section-head">
                  <span>NOMINEE INFORMATION</span>
                  <button type="button" className="emp-add-btn" onClick={addNomineeSection}>
                    <FaPlus size={11} /> Add Nominee
                  </button>
                </div>

                {INSFD.Nominee.map((nominee: any, index: number) => (
                  <NomineeRow key={index} isNew={newNomineeIndices.has(index)}>
                    <div className="emp-row-card">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-5">
                          <Selection label="Select Nominee" name="nominee" value={nominee.nominee_name} options={nomineeOptions} onChange={(e) => handleNomineeChange(index, "nominee_name", e.target.value)} />
                        </div>
                        <div className="md:col-span-5">
                          <FormFiled Lable="Aadhar Number" in_PlaceHolder="XXXX-XXXX-XXXX" value={nominee.nominee_aadhar} name={`nominee_aadhar_${index}`} onChange={(e) => handleNomineeChange(index, "nominee_aadhar", e.target.value)} />
                        </div>
                        <div className="md:col-span-2 flex items-end justify-center pb-2">
                          {INSFD.Nominee.length > 1 && (
                            <button type="button" className="emp-remove-btn" onClick={() => removeNomineeSection(index)}><FaTrash size={14} /></button>
                          )}
                        </div>
                      </div>
                    </div>
                  </NomineeRow>
                ))}
              </section>
            </AnimSection>
          )}



          <AnimSection delay={320}>
            <div className="pt-4">
              <button type="submit" className="emp-submit-btn">Next Step</button>
            </div>
          </AnimSection>
        </form>
      </div>
    </>
  );
};