import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

import Button from './Button';
import NativeCheckbox from './NativeCheckbox';
import iconsShape from './shapes/iconsShape';
import languageShape from './shapes/languageShape';

import * as Collapsible from "@radix-ui/react-collapsible";
import { ChevronRightIcon, DividerHorizontalIcon, CheckIcon } from "@radix-ui/react-icons";
import * as Checkbox from "@radix-ui/react-checkbox";

class TreeNode extends React.PureComponent {
    static propTypes = {
        checked: PropTypes.number.isRequired,
        disabled: PropTypes.bool.isRequired,
        expandDisabled: PropTypes.bool.isRequired,
        expanded: PropTypes.bool.isRequired,
        icons: iconsShape.isRequired,
        isLeaf: PropTypes.bool.isRequired,
        isParent: PropTypes.bool.isRequired,
        label: PropTypes.node.isRequired,
        lang: languageShape.isRequired,
        optimisticToggle: PropTypes.bool.isRequired,
        showNodeIcon: PropTypes.bool.isRequired,
        treeId: PropTypes.string.isRequired,
        value: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]).isRequired,
        onCheck: PropTypes.func.isRequired,
        onExpand: PropTypes.func.isRequired,

        children: PropTypes.node,
        className: PropTypes.string,
        expandOnClick: PropTypes.bool,
        icon: PropTypes.node,
        showCheckbox: PropTypes.bool,
        title: PropTypes.string,
        onClick: PropTypes.func,
        depth: PropTypes.number,
    };

    static defaultProps = {
        children: null,
        className: null,
        expandOnClick: false,
        icon: null,
        showCheckbox: true,
        title: null,
        onClick: null,
        depth: 0,
    };

    constructor(props) {
        super(props);

        this.onCheck = this.onCheck.bind(this);
        this.onCheckboxKeyPress = this.onCheckboxKeyPress.bind(this);
        this.onCheckboxKeyUp = this.onCheckboxKeyUp.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onExpand = this.onExpand.bind(this);

        this.setExpanded = this.setExpanded.bind(this)
        this.state = {
            expanded: !props.isLeaf && props.expanded,
        }
    }

    setExpanded(expanded) {
        this.setState({ expanded });

        // if (!expanded) {
        //     setTimeout(this.onExpand, 700)
        // } else {
        //     this.onExpand()
        // }
    }

    onCheck() {
        const { value, onCheck } = this.props;

        onCheck({ value, checked: this.getCheckState({ toggle: true }) });
    }

    onCheckboxKeyPress(event) {
        const { which } = event;

        // Prevent browser scroll when pressing space on the checkbox
        if (which === 32) {
            event.preventDefault();
        }
    }

    onCheckboxKeyUp(event) {
        const { keyCode } = event;

        if ([13, 32].includes(keyCode)) {
            this.onCheck();
        }
    }

    onClick() {
        const {
            expandOnClick,
            isParent,
            value,
            onClick,
        } = this.props;

        // Auto expand if enabled
        if (isParent && expandOnClick) {
            this.onExpand();
        }

        onClick({ value, checked: this.getCheckState({ toggle: false }) });
    }

    onExpand() {
        const { expanded, value, onExpand } = this.props;

        onExpand({ value, expanded: !expanded });
    }

    getCheckState({ toggle }) {
        const { checked, optimisticToggle } = this.props;

        // Toggle off state to checked
        if (checked === 0 && toggle) {
            return true;
        }

        // Node is already checked and we are not toggling
        if (checked === 1 && !toggle) {
            return true;
        }

        // Get/toggle partial state based on cascade model
        if (checked === 2) {
            return optimisticToggle;
        }

        return false;
    }

    renderCollapseButton() {
        const { expandDisabled, isLeaf, lang } = this.props;

        if (isLeaf) {
            return (
                <span className="rct-collapse">
                    <span className="rct-icon" />
                </span>
            );
        }

        return (
            <Button
                className="rct-collapse rct-collapse-btn"
                disabled={expandDisabled}
                title={lang.toggle}
                onClick={this.onExpand}
            >
                {this.renderCollapseIcon()}
            </Button>
        );
    }

    renderCollapseIcon() {
        const { expanded, icons: { expandClose, expandOpen } } = this.props;

        if (!expanded) {
            return expandClose;
        }

        return expandOpen;
    }

    renderCheckboxIcon() {
        const { checked, icons: { uncheck, check, halfCheck } } = this.props;

        if (checked === 0) {
            return uncheck;
        }

        if (checked === 1) {
            return check;
        }

        return halfCheck;
    }

    renderNodeIcon() {
        const {
            expanded,
            icon,
            icons: { leaf, parentClose, parentOpen },
            isLeaf,
        } = this.props;

        if (icon !== null) {
            return icon;
        }

        if (isLeaf) {
            return leaf;
        }

        if (!expanded) {
            return parentClose;
        }

        return parentOpen;
    }

    renderBareLabel(children) {
        const { onClick, title } = this.props;
        const clickable = onClick !== null;

        return (
            <span className="rct-bare-label" title={title}>
                {clickable ? (
                    <span
                        className="rct-node-clickable"
                        role="button"
                        tabIndex={0}
                        onClick={this.onClick}
                        onKeyPress={this.onClick}
                    >
                        {children}
                    </span>
                ) : children}
            </span>
        );
    }

    renderCheckboxLabel(children) {
        const {
            checked,
            disabled,
            title,
            treeId,
            value,
            onClick,
        } = this.props;
        const clickable = onClick !== null;
        const inputId = `${treeId}-${String(value).split(' ').join('_')}`;

        const render = [(
            <label key={0} htmlFor={inputId} title={title}>
                <NativeCheckbox
                    checked={checked === 1}
                    disabled={disabled}
                    id={inputId}
                    indeterminate={checked === 2}
                    onChange={() => {}}
                    onClick={this.onCheck}
                />
                <span
                    aria-checked={checked === 1}
                    aria-disabled={disabled}
                    aria-hidden="true"
                    className="rct-checkbox"
                    role="checkbox"
                    tabIndex={0}
                    onKeyPress={this.onCheckboxKeyPress}
                    onKeyUp={this.onCheckboxKeyUp}
                >
                    {this.renderCheckboxIcon()}
                </span>
                {!clickable ? children : null}
            </label>
        )];

        if (clickable) {
            render.push((
                <span
                    key={1}
                    className="rct-node-clickable"
                    role="button"
                    tabIndex={0}
                    onClick={this.onClick}
                    onKeyPress={this.onClick}
                >
                    {children}
                </span>
            ));
        }

        return render;
    }

    renderLabel() {
        const { label, showCheckbox, showNodeIcon } = this.props;
        const labelChildren = [
            showNodeIcon ? (
                <span key={0} className="rct-node-icon">
                    {this.renderNodeIcon()}
                </span>
            ) : null,
            <span key={1} className="rct-title">
                {label}
            </span>,
        ];

        if (!showCheckbox) {
            return this.renderBareLabel(labelChildren);
        }

        return this.renderCheckboxLabel(labelChildren);
    }

    renderChildren() {
        const { children, expanded } = this.props;

        // if (!expanded) {
        //     return null;
        // }

        return children;
    }

    render() {
        const {
            className,
            disabled,
            expanded,
            isLeaf,
            label,
            showCheckbox,
            showNodeIcon,
            checked,
            treeId,
            value,
            depth
        } = this.props;
        const nodeClass = classNames({
            'rct-node': true,
            'rct-node-leaf': isLeaf,
            'rct-node-parent': !isLeaf,
            'rct-node-expanded': !isLeaf && expanded,
            'rct-node-collapsed': !isLeaf && !expanded,
            'rct-disabled': disabled,
        }, className);

        const inputId = `${treeId}-${String(value).split(' ').join('_')}`;

        let rootClassName = "my-5";
        if (depth == 1)
        {
            rootClassName = "[&:not(:last-child)]:border-b first:mt-5"
        }
        else if (depth > 1) {
            rootClassName = "my-1";
        }

        let headerClassName = `flex-1 ${!isLeaf ? 'rounded-r' : 'rounded border-l'} p-[8px] h-[45px] border-r border-y border-[#f3f4f6] bg-[#f9fafb] justify-between flex items-center`
        if (depth > 0)
        {
            headerClassName = `flex-1 ${!isLeaf ? 'rounded-r' : 'rounded'} p-[8px] h-[45px] bg-white justify-between flex items-center`
        }

        let triggerClassName = "group rounded-l px-4 h-[45px] inline-flex items-center justify-center outline-none data-[state=closed]:bg-[#f9fafb] data-[state=closed]:border-[#f3f4f6] data-[state=open]:bg-[#3b82f6] data-[state=open]:border-[#3b82f6] hover:bg-violet3 border border-[#f3f4f6]"
        if (depth > 0)
        {
            triggerClassName = "group rounded-l px-4 h-[45px] inline-flex items-center justify-center outline-none data-[state=closed]:bg-white data-[state=closed]:border-[#f3f4f6] data-[state=open]:border-[#3b82f6] hover:bg-violet3";
        }

        let chevronClassName = "text-black w-6 h-6 ease-[cubic-bezier(0.87,_0,_0.13,_1)] transition-transform duration-300 group-data-[state=open]:rotate-90 group-data-[state=open]:text-white"
        if (depth > 0)
        {
            chevronClassName = "text-black w-6 h-6 ease-[cubic-bezier(0.87,_0,_0.13,_1)] transition-transform duration-300 group-data-[state=open]:rotate-90 group-data-[state=open]:text-[#3b82f6]"
        }

        return (
            <Collapsible.Root
            open={this.state.expanded}
            onOpenChange={this.setExpanded}
            className={rootClassName}
            >
                <div className={`flex items-center`}>
                    { !isLeaf && (
                    <Collapsible.Trigger asChild>
                        <button className={triggerClassName}>
                            <ChevronRightIcon
                            className={chevronClassName}
                            aria-hidden
                            />
                        </button>
                    </Collapsible.Trigger>
                    )}
                    <div className={headerClassName}>
                        <div className="flex gap-2">
                            <Checkbox.Root
                                className="shadow-blackA4 hover:bg-violet3 flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-[4px] bg-white shadow-[0_2px_4px_0px_rgba(0,0,0,0.1)] outline-none focus:shadow-[0_0_0_2px_black]"
                                id={inputId}
                                checked={checked === 1 ? true : (checked === 2 ? 'indeterminate' : false)}
                                onCheckedChange={this.onCheck}
                            >
                                <Checkbox.Indicator>
                                {checked === 2 && <DividerHorizontalIcon />}
                                {checked === 1 && <CheckIcon />}
                                </Checkbox.Indicator>
                            </Checkbox.Root>

                            <span className="text-black text-[15px] leading-[25px]">
                                {label}
                            </span>
                        </div>
                    </div>
                </div>

                <Collapsible.Content
                    style={{
                    ["--radix-accordion-content-height"]:
                        "var(--radix-collapsible-content-height)",
                    ["--radix-accordion-content-width"]:
                        "var(--radix-collapsible-content-width)",
                    }}
                    className={`data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden ml-5`}
                >
                    {this.renderChildren()}
                </Collapsible.Content>
            </Collapsible.Root>
        );
    }
}

export default TreeNode;
