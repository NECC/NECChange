import React, { useState, useId } from 'react';

import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';

import './sidebar.css';

const nodes = [{
  value: 'testes',
  label: 'Testes',
  children: [
    {
      value: '1a1s', label: '1 ANO - 1 SEMESTRE', children: [
        {
          value: 'tm',
          label: 'Topicos de Matematica',
        },
        {
          value: 'cal',
          label: 'Calculo',
        },
        {
          value: 'algebralinear',
          label: 'Algebra Linear',
        },
        {
          value: 'pf',
          label: 'Programacao Funcional',
        },
      ]
    },
    {
      value: '1a2s', label: '1 ANO - 2 SEMESTRE', children: [
        {
          value: 'md',
          label: 'Matematica Discreta',
        },
        {
          value: 'anal',
          label: 'Analise',
        },
        {
          value: 'geo',
          label: 'Geometria',
        },
        {
          value: 'pi',
          label: 'Programacao Imperativa',
        },
      ]
    },
    {
      value: '2a1s', label: '2 ANO - 1 SEMESTRE', children: [
      ]
    },
  ],
},
{
  value: 'eventos',
  label: 'Eventos',
  children: []
}
];

export type SidebarProps = {
  children: React.ReactElement
};

const Sidebar: React.FC<SidebarProps> = ({
  children
}) => {
  const [checked, setChecked] = useState(Array<string>);
  const [expanded, setExpanded] = useState(Array<string>);

  return (
    <>
      <div className="flex h-screen antialiased text-gray-900 bg-white dark:bg-dark dark:text-light">
        <aside className="z-10 w-96 border-r dark:border-orange-600 dark:bg-darker focus:outline-none">
          <div className="flex flex-col h-full px-5 py-14">
            <CheckboxTree
              id={useId()}
              nodes={nodes}
              checked={checked}
              expanded={expanded}
              onCheck={(checked) => {
                console.log(checked)
                setChecked(checked)}}
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

export default Sidebar;
