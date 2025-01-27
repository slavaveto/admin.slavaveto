export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <>
          <main className="flex flex-grow container mx-auto px-3 max-w-[500px]">
              {/*<div className="max-w-7xl flex flex-col gap-12 items-start">*/}
              {children}
              {/*</div>*/}
          </main>
          </>
          );
          }
