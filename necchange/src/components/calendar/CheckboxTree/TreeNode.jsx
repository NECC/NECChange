import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

import Button from './Button';
import NativeCheckbox from './NativeCheckbox';
import iconsShape from './shapes/iconsShape';
import languageShape from './shapes/languageShape';

import { Checkbox } from "@nextui-org/checkbox";
import { Accordion, AccordionItem } from "@nextui-org/react";

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
                    onChange={() => { }}
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
            depth,
        } = this.props;
        const nodeClass = classNames({
            'rct-node': true,
            'rct-node-leaf': isLeaf,
            'rct-node-parent': !isLeaf,
            'rct-node-expanded': !isLeaf && expanded,
            'rct-node-collapsed': !isLeaf && !expanded,
            'rct-disabled': disabled,
        }, className);

        const classBgColor = `${value.charAt(0) == '1' ? 'bg-blue-500' : value.charAt(0) == '2' ? 'bg-emerald-500' : value.charAt(0) == '3' ? 'bg-violet-500' : 'bg-black'}`;

        const inputId = `${treeId}-${String(value).split(' ').join('_')}`;

        const itemClasses = {
            base: "py-0 w-full",
            title: "font-normal text-medium",
            trigger: "px-2 py-0 data-[hover=true]:bg-default-100 rounded-lg h-14 flex items-center",
            indicator: "text-medium",
            content: "text-small px-2",
        };

        const dotStyle = `w-2 h-2 rounded-full ml-2 ${classBgColor}`;

        if (!isLeaf) {
            return (
                <Accordion showDivider={false} itemClasses={itemClasses}>
                    <AccordionItem startContent={
                        <Checkbox id={inputId} isSelected={checked === 1} isIndeterminate={checked === 2} onChange={this.onCheck}>
                            <div className="w-full flex justify-between gap-2 items-center">
                                <p>{label}</p>
                                <div hidden={depth > 0} className={dotStyle}></div>
                            </div>
                        </Checkbox>
                    }>
                        {this.renderChildren()}
                    </AccordionItem>
                </Accordion>
            )
        }
        else {
            return (
                <div className={itemClasses.content}>
                    <div className={itemClasses.trigger}>
                        <Checkbox isSelected={checked === 1} isIndeterminate={checked === 2} onChange={this.onCheck}>{label}</Checkbox>
                    </div>
                </div>
            )
        }
    }
}

export default TreeNode;
