import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';

import { Alert, Button, Card } from 'patternfly-react';
import * as React from 'react';
import { Loader, PageSection } from '../../../Layout';
import { ITextEditor, TextEditor } from '../../../Shared';
import './ViewEditContent.css';

import 'codemirror/addon/hint/show-hint.css';

require('codemirror/mode/sql/sql');
require('codemirror/addon/hint/show-hint');
require('codemirror/addon/hint/sql-hint');
require('codemirror/addon/edit/matchbrackets');

export interface IViewEditValidationResult {
  message: string;
  type: 'error' | 'success';
}

export interface IViewEditContentProps {
  viewDdl: string;

  /**
   * The localized text for the cancel button.
   */
  i18nCancelLabel: string;

  /**
   * The localized text for the save button.
   */
  i18nSaveLabel: string;

  /**
   * The localized text for the validate button.
   */
  i18nValidateLabel: string;

  /**
   * `true` if all form fields have valid values.
   */
  isValid: boolean;

  /**
   * `true` if the parent is doing some work and this form should disable user input.
   */
  isWorking: boolean;

  /**
   * View validationResults
   */
  validationResults: IViewEditValidationResult[];

  /**
   * The callback for when the save button is clicked
   * @param ddl the text area ddl
   */
  onSave: (ddl: string) => void;

  /**
   * The callback for when the validate button is clicked.
   * @param ddl the ddl
   */
  onValidate: (ddl: string) => void;

  /**
   * The callback for cancel editing
   */
  onCancel: () => void;
}

interface IViewEditContentState {
  ddlChanged: boolean;
  ddlValue: string;
  initialDdlValue: string;
  needsValidation: boolean;
}

export class ViewEditContent extends React.Component<
  IViewEditContentProps,
  IViewEditContentState
> {
  public static defaultProps = {
    validationResults: [],
  };

  constructor(props: IViewEditContentProps) {
    super(props);
    this.state = {
      ddlChanged: false,
      ddlValue: this.props.viewDdl,
      initialDdlValue: this.props.viewDdl,
      needsValidation: false,
    };
    this.handleDdlChange = this.handleDdlChange.bind(this);
    this.handleDdlValidation = this.handleDdlValidation.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  public handleDdlValidation = () => (event: any) => {
    const currentDdl = this.state.ddlValue;
    this.props.onValidate(currentDdl);
    this.setState({
      needsValidation: false,
    });
  };

  public handleDdlChange(editor: ITextEditor, data: any, value: string) {
    this.setState({
      ddlChanged: true,
      ddlValue: value,
      needsValidation: true,
    });
  }

  public handleSave = () => (event: any) => {
    const currentDdl = this.state.ddlValue;
    this.props.onSave(currentDdl);
  };

  public render() {
    const editorOptions = {
      gutters: ['CodeMirror-lint-markers'],
      lineNumbers: true,
      lineWrapping: true,
      mode: 'text/x-mysql',
      matchBrackets : true,
      autofocus: true,
      readOnly: false,
      showCursorWhenSelecting: true,
      styleActiveLine: true,
      tabSize: 2,
      extraKeys: {"Ctrl-Space": "autocomplete"},
      hintOptions: {tables: {
        users: ["name", "score", "birthDate"],
        countries: ["name", "population", "size"]
      }}
    };
    return (
      <PageSection>
        <Card>
          <Card.Body>
            {this.props.validationResults.map((e, idx) => (
              <Alert key={idx} type={e.type}>
                {e.message}
              </Alert>
            ))}
            <TextEditor
              value={this.state.initialDdlValue}
              options={editorOptions}
              onChange={this.handleDdlChange}
            />
            <Button
              bsStyle="default"
              disabled={this.props.isWorking}
              onClick={this.handleDdlValidation()}
            >
              {this.props.isWorking ? (
                <Loader size={'sm'} inline={true} />
              ) : null}
              {this.props.i18nValidateLabel}
            </Button>
          </Card.Body>
          <Card.Footer>
            <Button
              bsStyle="default"
              className="view-edit-content__editButton"
              disabled={this.props.isWorking}
              onClick={this.props.onCancel}
            >
              {this.props.i18nCancelLabel}
            </Button>
            <Button
              bsStyle="primary"
              className="view-edit-content__editButton"
              disabled={
                this.props.isWorking ||
                !this.props.isValid ||
                !this.state.ddlChanged ||
                this.state.needsValidation
              }
              onClick={this.handleSave()}
            >
              {this.props.i18nSaveLabel}
            </Button>
          </Card.Footer>
        </Card>
      </PageSection>
    );
  }
}
