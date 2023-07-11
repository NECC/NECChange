import React, { useState, useId } from 'react';
import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';

import './CalendarSidebarStyles.css';

export type UC = {
  id: number,
  name: string,
  year: number,
  semester: number,
}

function convertUCStoNodes(ucs: Array<UC>) {
  // Sort data
  ucs.sort((a, b) => {
    if (a.year !== b.year) {
      return a.year - b.year;
    }
    return a.semester - b.semester;
  });

  // Group objects by '$year - $semester', and put in CheckboxTree node form {value, label, children: Node[]}, ChatGPT
  const ucs_as_nodes = ucs.reduce((acc: any[], course) => {
    const { id, name, year, semester } = course;
    const label = `${year} ANO - ${semester} SEMESTRE`;
    const value = `${year}a${semester}s`;
    const formattedName = name.replace(/á/g, 'a').replace(/ç/g, 'c').replace(/\s+/g, ' ');
    const leafValue = id;

    const existingItem = acc.find((item) => item.label === label);
    if (existingItem) {
      existingItem.children.push({ value: leafValue, label: formattedName });
    } else {
      acc.push({ value, label, children: [{ value: leafValue, label: formattedName }] });
    }

    return acc;
  }, []);

  return [{
    value: 'testes',
    label: 'Testes',
    children: ucs_as_nodes,
  },
  {
    value: 'eventos',
    label: 'Eventos',
    children: []
  }
  ];
}

export default function Sidebar({
  children,
  ucs
}: {
  children: React.ReactNode,
  ucs: UC[]
}) {
  const [checked, setChecked] = useState(Array<string>);
  const [expanded, setExpanded] = useState(Array<string>);

  return (
    <>
      <div className="flex h-screen-full antialiased text-gray-900 bg-white dark:bg-dark dark:text-light pt-20">
        <aside className=" w-96 border-r dark:border-gray-200 dark:bg-darker focus:outline-none">
          <div className="flex flex-col h-full px-5 py-14">
            <CheckboxTree
              id={useId()}
              nodes={convertUCStoNodes(ucs)}
              checked={checked}
              expanded={expanded}
              onCheck={(checked) => {
                console.log(checked)
                setChecked(checked)
              }}
              onExpand={(expanded) => setExpanded(expanded)}
            />
          </div>
        </aside>
        <main className="flex-1 overflow-x-auto max-h-screen">
          {children}
        </main>
      </div>
    </>
  );
};
