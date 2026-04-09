function ComponentsIntro() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start not-italic overflow-clip relative shrink-0" data-name="Components Intro">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#1c5eff] text-[12px] tracking-[2.16px] w-[500px]">KNOWLAB COMPONENTS</p>
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[38px] relative shrink-0 text-[#11203b] text-[30px] w-[900px]">Reusable primitives and shell patterns for the migration build.</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[#475a7d] text-[16px] w-[980px]">These components intentionally mirror the current product language so route screens can be assembled with instances instead of one-off redraws.</p>
    </div>
  );
}

function PrimitiveComponentsHeader() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start not-italic overflow-clip relative shrink-0" data-name="Primitive Components Header">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#11203b] text-[22px] w-[720px]">Primitive Components</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[22px] relative shrink-0 text-[#73839f] text-[14px] w-[980px]">Core pieces for buttons, cards, inputs, chips, badges, and metrics.</p>
    </div>
  );
}

function Mark() {
  return (
    <div className="bg-[#1c5eff] overflow-clip relative rounded-[18px] shrink-0 size-[44px]" data-name="Mark">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[normal] left-[12px] not-italic text-[13px] text-white top-[13px] w-[20px]">LK</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start leading-[normal] not-italic overflow-clip relative shrink-0" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold relative shrink-0 text-[#11203b] text-[15px] w-[140px]">Knowlab</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal relative shrink-0 text-[#73839f] text-[12px] w-[180px]">Staff workspace</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start overflow-clip relative shrink-0" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#73839f] text-[12px] tracking-[1.2px] w-[200px]">Primitive / Logo</p>
      <div className="content-stretch flex gap-[12px] items-start relative shrink-0" data-name="Primitive / Logo">
        <Mark />
        <Frame1 />
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex gap-[12px] items-start overflow-clip relative shrink-0" data-name="Frame">
      <div className="bg-[#1c5eff] content-stretch flex items-center justify-center px-[18px] py-[14px] relative rounded-[16px] shrink-0" data-name="Primitive / Button / Primary">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[14px] text-white w-[120px]">Button label</p>
      </div>
      <div className="bg-white content-stretch flex items-center justify-center px-[18px] py-[14px] relative rounded-[16px] shrink-0" data-name="Primitive / Button / Secondary">
        <div aria-hidden="true" className="absolute border border-[#9bb3e5] border-solid inset-0 pointer-events-none rounded-[16px]" />
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#11203b] text-[14px] w-[120px]">Button label</p>
      </div>
      <div className="content-stretch flex items-center justify-center px-[18px] py-[14px] relative rounded-[16px] shrink-0" data-name="Primitive / Button / Ghost">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#475a7d] text-[14px] w-[120px]">Button label</p>
      </div>
      <div className="bg-[#fde9e9] content-stretch flex items-center justify-center px-[18px] py-[14px] relative rounded-[16px] shrink-0" data-name="Primitive / Button / Danger">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#b14343] text-[14px] w-[120px]">Button label</p>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start overflow-clip relative shrink-0" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#73839f] text-[12px] tracking-[1.2px] w-[200px]">Buttons</p>
      <Frame3 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex gap-[12px] items-start overflow-clip relative shrink-0" data-name="Frame">
      <div className="bg-white content-stretch flex items-start px-[14px] py-[8px] relative rounded-[999px] shrink-0" data-name="Primitive / Filter Chip / Default">
        <div aria-hidden="true" className="absolute border border-[#d3def5] border-solid inset-0 pointer-events-none rounded-[999px]" />
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#475a7d] text-[12px] w-[120px]">Hematology</p>
      </div>
      <div className="bg-[#e3edff] content-stretch flex items-start px-[14px] py-[8px] relative rounded-[999px] shrink-0" data-name="Primitive / Filter Chip / Active">
        <div aria-hidden="true" className="absolute border border-[#1c5eff] border-solid inset-0 pointer-events-none rounded-[999px]" />
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#1c5eff] text-[12px] w-[120px]">Hematology</p>
      </div>
      <div className="bg-[#e8f8f1] content-stretch flex items-start px-[14px] py-[8px] relative rounded-[999px] shrink-0" data-name="Primitive / Status Badge / Active">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#1c7b56] text-[12px] w-[120px]">Active</p>
      </div>
      <div className="bg-[#fff0db] content-stretch flex items-start px-[14px] py-[8px] relative rounded-[999px] shrink-0" data-name="Primitive / Status Badge / Review">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#9a6115] text-[12px] w-[120px]">Pending Review</p>
      </div>
      <div className="bg-[#fde9e9] content-stretch flex items-start px-[14px] py-[8px] relative rounded-[999px] shrink-0" data-name="Primitive / Status Badge / Overdue">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#b14343] text-[12px] w-[120px]">Overdue</p>
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start overflow-clip relative shrink-0" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#73839f] text-[12px] tracking-[1.2px] w-[200px]">Chips + Badges</p>
      <Frame5 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start overflow-clip relative shrink-0" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#73839f] text-[12px] tracking-[1.2px] w-[200px]">Search Field</p>
      <div className="bg-white content-stretch flex gap-[12px] items-start px-[16px] py-[14px] relative rounded-[16px] shrink-0" data-name="Primitive / Search Field">
        <div aria-hidden="true" className="absolute border border-[#d3def5] border-solid inset-0 pointer-events-none rounded-[16px]" />
        <div className="relative shrink-0 size-[16px]" data-name="Ellipse">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
            <circle cx="8" cy="8" fill="var(--fill-0, #1C5EFF)" id="Ellipse" r="8" />
          </svg>
        </div>
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#73839f] text-[14px] w-[260px]">Search SOPs, tests, and job aids</p>
      </div>
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex gap-[16px] items-start overflow-clip relative shrink-0" data-name="Frame">
      <div className="bg-white content-stretch flex flex-col gap-[12px] items-start p-[20px] relative rounded-[24px] shrink-0" data-name="Primitive / Surface Card">
        <div aria-hidden="true" className="absolute border border-[#d3def5] border-solid inset-0 pointer-events-none rounded-[24px] shadow-[0px_6px_18px_0px_rgba(15,40,90,0.05)]" />
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#11203b] text-[16px] w-[220px]">Surface title</p>
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[22px] not-italic relative shrink-0 text-[#475a7d] text-[13px] w-[240px]">Reusable content container for lists, tables, panels, and dashboard modules.</p>
      </div>
      <div className="bg-white content-stretch flex flex-col gap-[10px] items-start p-[18px] relative rounded-[24px] shrink-0" data-name="Primitive / Metric Tile">
        <div aria-hidden="true" className="absolute border border-[#d3def5] border-solid inset-0 pointer-events-none rounded-[24px] shadow-[0px_6px_18px_0px_rgba(15,40,90,0.05)]" />
        <div className="bg-[#1c5eff] h-[4px] rounded-[999px] shrink-0 w-[220px]" data-name="Rectangle" />
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#475a7d] text-[14px] w-[180px]">Open CAPA items</p>
        <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[#11203b] text-[30px] w-[80px]">12</p>
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#73839f] text-[12px] w-[180px]">3 newly assigned today</p>
      </div>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start overflow-clip relative shrink-0" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#73839f] text-[12px] tracking-[1.2px] w-[200px]">Cards + Metrics</p>
      <Frame8 />
    </div>
  );
}

function PrimitiveShowcase() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start overflow-clip relative shrink-0" data-name="Primitive Showcase">
      <Frame />
      <Frame2 />
      <Frame4 />
      <Frame6 />
      <Frame7 />
    </div>
  );
}

function PrimitiveComponents() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start overflow-clip relative shrink-0" data-name="Primitive Components">
      <PrimitiveComponentsHeader />
      <PrimitiveShowcase />
    </div>
  );
}

function ShellComponentsHeader() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start not-italic overflow-clip relative shrink-0" data-name="Shell Components Header">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#11203b] text-[22px] w-[720px]">Shell Components</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[22px] relative shrink-0 text-[#73839f] text-[14px] w-[980px]">Shared navigation and chrome for desktop and mobile route frames.</p>
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-center justify-center overflow-clip relative shrink-0" data-name="Frame">
      <div className="relative shrink-0 size-[14px]" data-name="Ellipse">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
          <circle cx="7" cy="7" fill="var(--fill-0, #1C5EFF)" id="Ellipse" r="7" />
        </svg>
      </div>
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#1c5eff] text-[11px] w-[60px]">Home</p>
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-center justify-center overflow-clip relative shrink-0" data-name="Frame">
      <div className="relative shrink-0 size-[14px]" data-name="Ellipse">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
          <circle cx="7" cy="7" fill="var(--fill-0, #C4D2EF)" id="Ellipse" r="7" />
        </svg>
      </div>
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#73839f] text-[11px] w-[60px]">SOPs</p>
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-center justify-center overflow-clip relative shrink-0" data-name="Frame">
      <div className="relative shrink-0 size-[14px]" data-name="Ellipse">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
          <circle cx="7" cy="7" fill="var(--fill-0, #C4D2EF)" id="Ellipse" r="7" />
        </svg>
      </div>
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#73839f] text-[11px] w-[60px]">Tests</p>
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-center justify-center overflow-clip relative shrink-0" data-name="Frame">
      <div className="relative shrink-0 size-[14px]" data-name="Ellipse">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
          <circle cx="7" cy="7" fill="var(--fill-0, #C4D2EF)" id="Ellipse" r="7" />
        </svg>
      </div>
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#73839f] text-[11px] w-[60px]">More</p>
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start overflow-clip relative shrink-0" data-name="Frame">
      <div className="bg-[#e3edff] content-stretch flex gap-[12px] items-start px-[14px] py-[12px] relative rounded-[18px] shrink-0" data-name="Shell / Sidebar Nav Item">
        <div className="relative shrink-0 size-[14px]" data-name="Ellipse">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
            <circle cx="7" cy="7" fill="var(--fill-0, #1C5EFF)" id="Ellipse" r="7" />
          </svg>
        </div>
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#1c5eff] text-[14px] w-[120px]">Dashboard</p>
      </div>
      <div className="bg-white content-stretch flex gap-[20px] items-start px-[20px] py-[12px] relative rounded-[24px] shrink-0" data-name="Shell / Mobile Bottom Nav">
        <div aria-hidden="true" className="absolute border border-[#d3def5] border-solid inset-0 pointer-events-none rounded-[24px]" />
        <Frame11 />
        <Frame12 />
        <Frame13 />
        <Frame14 />
      </div>
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start overflow-clip relative shrink-0" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#73839f] text-[12px] tracking-[1.2px] w-[200px]">Sidebar + Mobile Nav</p>
      <Frame10 />
    </div>
  );
}

function ShellRow() {
  return (
    <div className="content-stretch flex items-start overflow-clip relative shrink-0" data-name="Shell Row">
      <Frame9 />
    </div>
  );
}

function ShellComponents() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start overflow-clip relative shrink-0" data-name="Shell Components">
      <ShellComponentsHeader />
      <ShellRow />
    </div>
  );
}

function FormPatternsHeader() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start not-italic overflow-clip relative shrink-0" data-name="Form Patterns Header">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#11203b] text-[22px] w-[720px]">Form Patterns</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[22px] relative shrink-0 text-[#73839f] text-[14px] w-[980px]">Inputs and helper stacks for auth, create, and edit flows.</p>
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start leading-[normal] not-italic overflow-clip relative shrink-0" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold relative shrink-0 text-[#1c5eff] text-[11px] tracking-[1.32px] w-[180px]">WORKSPACE DETECTED</p>
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold relative shrink-0 text-[#11203b] text-[14px] w-[160px]">Haematology</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal relative shrink-0 text-[#73839f] text-[13px] w-[160px]">Fatima Bello</p>
    </div>
  );
}

function Frame15() {
  return (
    <div className="bg-[#eef5ff] relative rounded-[20px] shrink-0" data-name="Frame">
      <div className="content-stretch flex gap-[14px] items-start overflow-clip p-[16px] relative rounded-[inherit]">
        <Frame16 />
        <div className="bg-[#e8f0ff] content-stretch flex items-start px-[14px] py-[8px] relative rounded-[999px] shrink-0" data-name="Pattern / Role Pill / Supervisor">
          <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#1a56db] text-[12px] w-[120px]">Supervisor</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#bdd3ff] border-solid inset-0 pointer-events-none rounded-[20px]" />
    </div>
  );
}

function PatternFormCardPreview() {
  return (
    <div className="bg-white relative rounded-[28px] shrink-0" data-name="Pattern / Form Card Preview">
      <div className="content-stretch flex flex-col gap-[16px] items-start overflow-clip p-[24px] relative rounded-[inherit]">
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#11203b] text-[16px] w-[300px]">Pattern / Form Section</p>
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#11203b] text-[14px] w-[160px]">Work email</p>
        <div className="bg-white content-stretch flex gap-[12px] items-start px-[16px] py-[14px] relative rounded-[16px] shrink-0" data-name="Primitive / Search Field">
          <div aria-hidden="true" className="absolute border border-[#d3def5] border-solid inset-0 pointer-events-none rounded-[16px]" />
          <div className="relative shrink-0 size-[16px]" data-name="Ellipse">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
              <circle cx="8" cy="8" fill="var(--fill-0, #1C5EFF)" id="Ellipse" r="8" />
            </svg>
          </div>
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#73839f] text-[14px] w-[260px]">Search SOPs, tests, and job aids</p>
        </div>
        <Frame15 />
        <div className="bg-[#1c5eff] content-stretch flex items-center justify-center px-[18px] py-[14px] relative rounded-[16px] shrink-0" data-name="Primitive / Button / Primary">
          <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[14px] text-white w-[120px]">Button label</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d3def5] border-solid inset-0 pointer-events-none rounded-[28px]" />
    </div>
  );
}

function FormPatterns() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start overflow-clip relative shrink-0" data-name="Form Patterns">
      <FormPatternsHeader />
      <PatternFormCardPreview />
    </div>
  );
}

export default function ComponentsBoard() {
  return (
    <div className="bg-[#f5f9ff] content-stretch flex flex-col gap-[28px] items-start p-[40px] relative size-full" data-name="Components Board">
      <ComponentsIntro />
      <PrimitiveComponents />
      <ShellComponents />
      <FormPatterns />
    </div>
  );
}