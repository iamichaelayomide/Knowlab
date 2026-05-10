function FoundationIntro() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start not-italic overflow-clip relative shrink-0" data-name="Foundation Intro">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#1c5eff] text-[12px] tracking-[2.16px] w-[500px]">KNOWLAB FOUNDATIONS</p>
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[38px] relative shrink-0 text-[#11203b] text-[32px] w-[920px]">Color, typography, spacing, and surface language for the product migration.</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[26px] relative shrink-0 text-[#475a7d] text-[16px] w-[980px]">These foundations mirror the current application tokens from globals.css and establish a reusable source for the full-screen Figma build.</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start not-italic overflow-clip relative shrink-0" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#11203b] text-[22px] w-[720px]">Color Tokens</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[22px] relative shrink-0 text-[#73839f] text-[14px] w-[980px]">Primary UI colors mirrored from CSS custom properties.</p>
    </div>
  );
}

function ColorBackground() {
  return (
    <div className="bg-white relative rounded-[20px] shrink-0" data-name="Color / Background">
      <div className="content-stretch flex flex-col gap-[12px] items-start overflow-clip p-[12px] relative rounded-[inherit]">
        <div className="bg-[#eef4ff] h-[88px] rounded-[16px] shrink-0 w-[120px]" data-name="Background Swatch" />
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#11203b] text-[13px] w-[120px]">Background</p>
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#73839f] text-[12px] w-[120px]">#eef4ff</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d7e3fb] border-solid inset-0 pointer-events-none rounded-[20px]" />
    </div>
  );
}

function ColorSidebar() {
  return (
    <div className="bg-white relative rounded-[20px] shrink-0" data-name="Color / Sidebar">
      <div className="content-stretch flex flex-col gap-[12px] items-start overflow-clip p-[12px] relative rounded-[inherit]">
        <div className="bg-[#f7faff] h-[88px] rounded-[16px] shrink-0 w-[120px]" data-name="Sidebar Swatch" />
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#11203b] text-[13px] w-[120px]">Sidebar</p>
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#73839f] text-[12px] w-[120px]">#f7faff</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d7e3fb] border-solid inset-0 pointer-events-none rounded-[20px]" />
    </div>
  );
}

function ColorPanel() {
  return (
    <div className="bg-white relative rounded-[20px] shrink-0" data-name="Color / Panel">
      <div className="content-stretch flex flex-col gap-[12px] items-start overflow-clip p-[12px] relative rounded-[inherit]">
        <div className="bg-white h-[88px] rounded-[16px] shrink-0 w-[120px]" data-name="Panel Swatch" />
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#11203b] text-[13px] w-[120px]">Panel</p>
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#73839f] text-[12px] w-[120px]">#ffffff</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d7e3fb] border-solid inset-0 pointer-events-none rounded-[20px]" />
    </div>
  );
}

function ColorPanelRaised() {
  return (
    <div className="bg-white relative rounded-[20px] shrink-0" data-name="Color / Panel Raised">
      <div className="content-stretch flex flex-col gap-[12px] items-start overflow-clip p-[12px] relative rounded-[inherit]">
        <div className="bg-[#f4f8ff] h-[88px] rounded-[16px] shrink-0 w-[120px]" data-name="Panel Raised Swatch" />
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#11203b] text-[13px] w-[120px]">Panel Raised</p>
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#73839f] text-[12px] w-[120px]">#f4f8ff</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d7e3fb] border-solid inset-0 pointer-events-none rounded-[20px]" />
    </div>
  );
}

function ColorTextPrimary() {
  return (
    <div className="bg-white relative rounded-[20px] shrink-0" data-name="Color / Text Primary">
      <div className="content-stretch flex flex-col gap-[12px] items-start overflow-clip p-[12px] relative rounded-[inherit]">
        <div className="bg-[#11203b] h-[88px] rounded-[16px] shrink-0 w-[120px]" data-name="Text Primary Swatch" />
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#11203b] text-[13px] w-[120px]">Text Primary</p>
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#73839f] text-[12px] w-[120px]">#11203b</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d7e3fb] border-solid inset-0 pointer-events-none rounded-[20px]" />
    </div>
  );
}

function ColorTextSecondary() {
  return (
    <div className="bg-white relative rounded-[20px] shrink-0" data-name="Color / Text Secondary">
      <div className="content-stretch flex flex-col gap-[12px] items-start overflow-clip p-[12px] relative rounded-[inherit]">
        <div className="bg-[#475a7d] h-[88px] rounded-[16px] shrink-0 w-[120px]" data-name="Text Secondary Swatch" />
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#11203b] text-[13px] w-[120px]">Text Secondary</p>
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#73839f] text-[12px] w-[120px]">#475a7d</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d7e3fb] border-solid inset-0 pointer-events-none rounded-[20px]" />
    </div>
  );
}

function ColorTextMuted() {
  return (
    <div className="bg-white relative rounded-[20px] shrink-0" data-name="Color / Text Muted">
      <div className="content-stretch flex flex-col gap-[12px] items-start overflow-clip p-[12px] relative rounded-[inherit]">
        <div className="bg-[#73839f] h-[88px] rounded-[16px] shrink-0 w-[120px]" data-name="Text Muted Swatch" />
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#11203b] text-[13px] w-[120px]">Text Muted</p>
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#73839f] text-[12px] w-[120px]">#73839f</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d7e3fb] border-solid inset-0 pointer-events-none rounded-[20px]" />
    </div>
  );
}

function ColorAccent() {
  return (
    <div className="bg-white relative rounded-[20px] shrink-0" data-name="Color / Accent">
      <div className="content-stretch flex flex-col gap-[12px] items-start overflow-clip p-[12px] relative rounded-[inherit]">
        <div className="bg-[#1c5eff] h-[88px] rounded-[16px] shrink-0 w-[120px]" data-name="Accent Swatch" />
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#11203b] text-[13px] w-[120px]">Accent</p>
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#73839f] text-[12px] w-[120px]">#1c5eff</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d7e3fb] border-solid inset-0 pointer-events-none rounded-[20px]" />
    </div>
  );
}

function ColorAccentStrong() {
  return (
    <div className="bg-white relative rounded-[20px] shrink-0" data-name="Color / Accent Strong">
      <div className="content-stretch flex flex-col gap-[12px] items-start overflow-clip p-[12px] relative rounded-[inherit]">
        <div className="bg-[#0f86ff] h-[88px] rounded-[16px] shrink-0 w-[120px]" data-name="Accent Strong Swatch" />
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#11203b] text-[13px] w-[120px]">Accent Strong</p>
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#73839f] text-[12px] w-[120px]">#0f86ff</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d7e3fb] border-solid inset-0 pointer-events-none rounded-[20px]" />
    </div>
  );
}

function ColorAccentSoft() {
  return (
    <div className="bg-white relative rounded-[20px] shrink-0" data-name="Color / Accent Soft">
      <div className="content-stretch flex flex-col gap-[12px] items-start overflow-clip p-[12px] relative rounded-[inherit]">
        <div className="bg-[#e3edff] h-[88px] rounded-[16px] shrink-0 w-[120px]" data-name="Accent Soft Swatch" />
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#11203b] text-[13px] w-[120px]">Accent Soft</p>
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#73839f] text-[12px] w-[120px]">#e3edff</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d7e3fb] border-solid inset-0 pointer-events-none rounded-[20px]" />
    </div>
  );
}

function ColorSuccess() {
  return (
    <div className="bg-white relative rounded-[20px] shrink-0" data-name="Color / Success">
      <div className="content-stretch flex flex-col gap-[12px] items-start overflow-clip p-[12px] relative rounded-[inherit]">
        <div className="bg-[#1c7b56] h-[88px] rounded-[16px] shrink-0 w-[120px]" data-name="Success Swatch" />
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#11203b] text-[13px] w-[120px]">Success</p>
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#73839f] text-[12px] w-[120px]">#1c7b56</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d7e3fb] border-solid inset-0 pointer-events-none rounded-[20px]" />
    </div>
  );
}

function ColorWarning() {
  return (
    <div className="bg-white relative rounded-[20px] shrink-0" data-name="Color / Warning">
      <div className="content-stretch flex flex-col gap-[12px] items-start overflow-clip p-[12px] relative rounded-[inherit]">
        <div className="bg-[#9a6115] h-[88px] rounded-[16px] shrink-0 w-[120px]" data-name="Warning Swatch" />
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#11203b] text-[13px] w-[120px]">Warning</p>
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#73839f] text-[12px] w-[120px]">#9a6115</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d7e3fb] border-solid inset-0 pointer-events-none rounded-[20px]" />
    </div>
  );
}

function ColorDanger() {
  return (
    <div className="bg-white relative rounded-[20px] shrink-0" data-name="Color / Danger">
      <div className="content-stretch flex flex-col gap-[12px] items-start overflow-clip p-[12px] relative rounded-[inherit]">
        <div className="bg-[#b14343] h-[88px] rounded-[16px] shrink-0 w-[120px]" data-name="Danger Swatch" />
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#11203b] text-[13px] w-[120px]">Danger</p>
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#73839f] text-[12px] w-[120px]">#b14343</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d7e3fb] border-solid inset-0 pointer-events-none rounded-[20px]" />
    </div>
  );
}

function ColorGrid() {
  return (
    <div className="content-stretch flex gap-[16px] items-start overflow-clip relative shrink-0" data-name="Color Grid">
      <ColorBackground />
      <ColorSidebar />
      <ColorPanel />
      <ColorPanelRaised />
      <ColorTextPrimary />
      <ColorTextSecondary />
      <ColorTextMuted />
      <ColorAccent />
      <ColorAccentStrong />
      <ColorAccentSoft />
      <ColorSuccess />
      <ColorWarning />
      <ColorDanger />
    </div>
  );
}

function ColorTokens() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-start overflow-clip relative shrink-0" data-name="Color Tokens">
      <Frame />
      <ColorGrid />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start overflow-clip relative shrink-0" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#11203b] text-[22px] w-[720px]">Typography</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[22px] relative shrink-0 text-[#73839f] text-[14px] w-[980px]">Inter-based approximation of the application typography hierarchy for the migration pass.</p>
    </div>
  );
}

function TypeDisplay() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start overflow-clip relative shrink-0" data-name="Type / Display">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#73839f] text-[12px] tracking-[1.2px] w-[180px]">Display</p>
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[54px] relative shrink-0 text-[#11203b] text-[40px] w-[900px]">Start with the exact unit knowledge you need.</p>
    </div>
  );
}

function TypePageTitle() {
  return (
    <div className="content-stretch flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold gap-[6px] items-start overflow-clip relative shrink-0" data-name="Type / Page Title">
      <p className="leading-[normal] relative shrink-0 text-[#73839f] text-[12px] tracking-[1.2px] w-[180px]">Page Title</p>
      <p className="leading-[43px] relative shrink-0 text-[#11203b] text-[32px] w-[900px]">Sign in to continue.</p>
    </div>
  );
}

function TypeSectionTitle() {
  return (
    <div className="content-stretch flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold gap-[6px] items-start overflow-clip relative shrink-0" data-name="Type / Section Title">
      <p className="leading-[normal] relative shrink-0 text-[#73839f] text-[12px] tracking-[1.2px] w-[180px]">Section Title</p>
      <p className="leading-[27px] relative shrink-0 text-[#11203b] text-[20px] w-[900px]">Quick Job Aids</p>
    </div>
  );
}

function TypeBody() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start overflow-clip relative shrink-0" data-name="Type / Body">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#73839f] text-[12px] tracking-[1.2px] w-[180px]">Body</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[22px] relative shrink-0 text-[#475a7d] text-[16px] w-[900px]">Knowlab keeps SOP access, test guidance, training follow-up, and supervisor oversight inside the same secure workspace.</p>
    </div>
  );
}

function TypeLabel() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start overflow-clip relative shrink-0" data-name="Type / Label">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#73839f] text-[12px] tracking-[1.2px] w-[180px]">Label</p>
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[19px] relative shrink-0 text-[#1c5eff] text-[14px] w-[900px]">Secure workspace sign in</p>
    </div>
  );
}

function TypeCaption() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start overflow-clip relative shrink-0 text-[#73839f] text-[12px]" data-name="Type / Caption">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] relative shrink-0 tracking-[1.2px] w-[180px]">Caption</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 w-[900px]">Use fixture-driven representative content for route detail pages.</p>
    </div>
  );
}

function TypographyStack() {
  return (
    <div className="content-stretch flex flex-col gap-[18px] items-start overflow-clip relative shrink-0" data-name="Typography Stack">
      <TypeDisplay />
      <TypePageTitle />
      <TypeSectionTitle />
      <TypeBody />
      <TypeLabel />
      <TypeCaption />
    </div>
  );
}

function Typography() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-start not-italic overflow-clip relative shrink-0" data-name="Typography">
      <Frame1 />
      <TypographyStack />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start not-italic overflow-clip relative shrink-0" data-name="Frame">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#11203b] text-[22px] w-[720px]">Layout Tokens</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[22px] relative shrink-0 text-[#73839f] text-[14px] w-[980px]">Spacing, radii, and elevation values derived from the current UI primitives.</p>
    </div>
  );
}

function LayoutSpacing() {
  return (
    <div className="bg-white h-[120px] relative rounded-[24px] shrink-0 w-[280px]" data-name="Layout / Spacing">
      <div className="content-stretch flex flex-col gap-[10px] items-start not-italic overflow-clip p-[18px] relative rounded-[inherit] size-full">
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#11203b] text-[15px] w-[220px]">Spacing</p>
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[22px] relative shrink-0 text-[#475a7d] text-[13px] w-[220px]">4, 6, 8, 12, 16, 20, 24, 32, 40</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d7e3fb] border-solid inset-0 pointer-events-none rounded-[24px] shadow-[0px_12px_30px_0px_rgba(15,40,90,0.08)]" />
    </div>
  );
}

function LayoutRadius() {
  return (
    <div className="bg-white h-[120px] relative rounded-[24px] shrink-0 w-[280px]" data-name="Layout / Radius">
      <div className="content-stretch flex flex-col gap-[10px] items-start not-italic overflow-clip p-[18px] relative rounded-[inherit] size-full">
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#11203b] text-[15px] w-[220px]">Radius</p>
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[22px] relative shrink-0 text-[#475a7d] text-[13px] w-[220px]">16, 18, 20, 22, 24, 28, 30</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d7e3fb] border-solid inset-0 pointer-events-none rounded-[24px] shadow-[0px_12px_30px_0px_rgba(15,40,90,0.08)]" />
    </div>
  );
}

function LayoutElevation() {
  return (
    <div className="bg-white h-[120px] relative rounded-[24px] shrink-0 w-[280px]" data-name="Layout / Elevation">
      <div className="content-stretch flex flex-col gap-[10px] items-start not-italic overflow-clip p-[18px] relative rounded-[inherit] size-full">
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#11203b] text-[15px] w-[220px]">Elevation</p>
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[22px] relative shrink-0 text-[#475a7d] text-[13px] w-[220px]">Soft cards, raised tables, hero panel overlays</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d7e3fb] border-solid inset-0 pointer-events-none rounded-[24px] shadow-[0px_12px_30px_0px_rgba(15,40,90,0.08)]" />
    </div>
  );
}

function LayoutShellWidths() {
  return (
    <div className="bg-white h-[120px] relative rounded-[24px] shrink-0 w-[280px]" data-name="Layout / Shell Widths">
      <div className="content-stretch flex flex-col gap-[10px] items-start not-italic overflow-clip p-[18px] relative rounded-[inherit] size-full">
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#11203b] text-[15px] w-[220px]">Shell Widths</p>
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[22px] relative shrink-0 text-[#475a7d] text-[13px] w-[220px]">Sidebar 264, desktop content fluid, mobile bottom nav pinned</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d7e3fb] border-solid inset-0 pointer-events-none rounded-[24px] shadow-[0px_12px_30px_0px_rgba(15,40,90,0.08)]" />
    </div>
  );
}

function LayoutRow() {
  return (
    <div className="content-stretch flex gap-[16px] items-start overflow-clip relative shrink-0" data-name="Layout Row">
      <LayoutSpacing />
      <LayoutRadius />
      <LayoutElevation />
      <LayoutShellWidths />
    </div>
  );
}

function LayoutTokens() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-start overflow-clip relative shrink-0" data-name="Layout Tokens">
      <Frame2 />
      <LayoutRow />
    </div>
  );
}

export default function FoundationsBoard() {
  return (
    <div className="bg-[#f5f9ff] content-stretch flex flex-col gap-[32px] items-start p-[40px] relative size-full" data-name="Foundations Board">
      <FoundationIntro />
      <ColorTokens />
      <Typography />
      <LayoutTokens />
    </div>
  );
}