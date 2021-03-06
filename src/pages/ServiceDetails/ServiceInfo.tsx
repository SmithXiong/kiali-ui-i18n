import * as React from 'react';
import { style } from 'typestyle';
import { Grid, GridItem, Tab } from '@patternfly/react-core';
import * as API from '../../services/Api';
import * as AlertUtils from '../../utils/AlertUtils';
import ServiceId from '../../types/ServiceId';
import ServiceInfoDescription from './ServiceInfo/ServiceInfoDescription';
import { ServiceDetailsInfo, validationToSeverity } from '../../types/ServiceInfo';
import ServiceInfoVirtualServices from './ServiceInfo/ServiceInfoVirtualServices';
import ServiceInfoDestinationRules from './ServiceInfo/ServiceInfoDestinationRules';
import ServiceInfoWorkload from './ServiceInfo/ServiceInfoWorkload';
import { ObjectValidation, Validations, ValidationTypes } from '../../types/IstioObjects';
import { ThreeScaleInfo, ThreeScaleServiceRule } from '../../types/ThreeScale';
import ParameterizedTabs, { activeTab } from '../../components/Tab/Tabs';
import ErrorBoundaryWithMessage from '../../components/ErrorBoundary/ErrorBoundaryWithMessage';
import Validation from '../../components/Validations/Validation';
import { RenderComponentScroll } from '../../components/Nav/Page';
import { PromisesRegistry } from 'utils/CancelablePromises';
import Namespace from 'types/Namespace';
import { MessageType } from 'types/MessageCenter';
import { serverConfig } from 'config';
import DestinationRuleValidator from './ServiceInfo/types/DestinationRuleValidator';
import { DurationInSeconds } from 'types/Common';
import { DurationDropdownContainer } from 'components/DurationDropdown/DurationDropdown';
import RefreshButtonContainer from 'components/Refresh/RefreshButton';
import IstioWizardDropdown from 'components/IstioWizards/IstioWizardDropdown';
import GraphDataSource from 'services/GraphDataSource';
import { RightActionBar } from 'components/RightActionBar/RightActionBar';

interface Props extends ServiceId {
  duration: DurationInSeconds;
}

type ServiceInfoState = {
  serviceDetails?: ServiceDetailsInfo;
  gateways: string[];
  validations: Validations;
  threeScaleInfo: ThreeScaleInfo;
  threeScaleServiceRule?: ThreeScaleServiceRule;
  currentTab: string;
};

interface ValidationChecks {
  hasVirtualServiceChecks: boolean;
  hasDestinationRuleChecks: boolean;
}

const tabIconStyle = style({
  fontSize: '0.9em'
});

const tabName = 'list';
const defaultTab = 'workloads';
const paramToTab: { [key: string]: number } = {
  workloads: 0,
  virtualservices: 1,
  destinationrules: 2
};

const emptyThreeScale: ThreeScaleInfo = {
  enabled: false,
  permissions: { create: false, update: false, delete: false }
};

class ServiceInfo extends React.Component<Props, ServiceInfoState> {
  private promises = new PromisesRegistry();
  private graphDataSource = new GraphDataSource();

  constructor(props: Props) {
    super(props);
    this.state = {
      gateways: [],
      validations: {},
      threeScaleInfo: emptyThreeScale,
      currentTab: activeTab(tabName, defaultTab)
    };
  }

  componentDidMount() {
    this.fetchBackend();
  }

  componentDidUpdate(prev: Props) {
    const aTab = activeTab(tabName, defaultTab);
    if (this.state.currentTab !== aTab) {
      this.setState({ currentTab: aTab });
    }
    if (prev.duration !== this.props.duration) {
      this.fetchBackend();
    }
  }

  private fetchBackend = () => {
    this.promises.cancelAll();
    this.promises
      .register('namespaces', API.getNamespaces())
      .then(namespacesResponse => {
        const namespaces: Namespace[] = namespacesResponse.data;
        this.promises
          .registerAll(
            'gateways',
            namespaces.map(ns => API.getIstioConfig(ns.name, ['gateways'], false))
          )
          .then(responses => {
            let gatewayList: string[] = [];
            responses.forEach(response => {
              const ns = response.data.namespace;
              response.data.gateways.forEach(gw => {
                gatewayList = gatewayList.concat(ns.name + '/' + gw.metadata.name);
              });
            });
            this.setState({ gateways: gatewayList });
          })
          .catch(gwError => {
            AlertUtils.addError('Could not fetch Gateways list.', gwError);
          });
      })
      .catch(error => {
        AlertUtils.addError('Could not fetch Namespaces list.', error);
      });

    API.getServiceDetail(this.props.namespace, this.props.service, true, this.props.duration)
      .then(results => {
        this.setState({
          serviceDetails: results,
          validations: ServiceInfo.addFormatValidation(results, results.validations)
        });
      })
      .catch(error => {
        AlertUtils.addError('Could not fetch Service Details.', error);
      });

    this.graphDataSource.fetchForService(this.props.duration, this.props.namespace, this.props.service);

    if (serverConfig.extensions?.threescale?.enabled) {
      API.getThreeScaleInfo()
        .then(results => {
          this.setState({
            threeScaleInfo: results.data
          });
          if (results.data.enabled) {
            API.getThreeScaleServiceRule(this.props.namespace, this.props.service)
              .then(result => {
                this.setState({
                  threeScaleServiceRule: result.data
                });
              })
              .catch(error => {
                this.setState({
                  threeScaleServiceRule: undefined
                });
                // Only log 500 errors. 404 response is a valid response on this composition case
                if (error.response && error.response.status >= 500) {
                  AlertUtils.addError('Could not fetch ThreeScaleServiceRule.', error);
                }
              });
          }
        })
        .catch(error => {
          AlertUtils.addError(
            'Could not fetch 3scale info. Turning off 3scale integration.',
            error,
            'default',
            MessageType.INFO
          );
        });
    }
  };

  static addFormatValidation(details: ServiceDetailsInfo, validations: Validations): Validations {
    details.destinationRules.items.forEach(destinationRule => {
      const dr = new DestinationRuleValidator(destinationRule);
      const formatValidation = dr.formatValidation();

      if (validations.destinationrule) {
        const objectValidations = validations.destinationrule[destinationRule.metadata.name];
        if (
          formatValidation !== null &&
          objectValidations.checks &&
          !objectValidations.checks.some(check => check.message === formatValidation.message)
        ) {
          objectValidations.checks.push(formatValidation);
          objectValidations.valid = false;
        }
      }
    });
    return validations ? validations : {};
  }

  private validationChecks(): ValidationChecks {
    const validationChecks = {
      hasVirtualServiceChecks: false,
      hasDestinationRuleChecks: false
    };
    const validations = this.state.validations || {};
    if (this.state.serviceDetails) {
      validationChecks.hasVirtualServiceChecks = this.state.serviceDetails.virtualServices.items.some(
        virtualService =>
          validations.virtualservice &&
          validations.virtualservice[virtualService.metadata.name] &&
          validations.virtualservice[virtualService.metadata.name].checks &&
          validations.virtualservice[virtualService.metadata.name].checks.length > 0
      );
      validationChecks.hasDestinationRuleChecks = this.state.serviceDetails.destinationRules.items.some(
        destinationRule =>
          validations.destinationrule &&
          destinationRule.metadata &&
          validations.destinationrule[destinationRule.metadata.name] &&
          validations.destinationrule[destinationRule.metadata.name].checks &&
          validations.destinationrule[destinationRule.metadata.name].checks.length > 0
      );
    }

    return validationChecks;
  }

  private errorBoundaryMessage(resourceName: string) {
    return `One of the ${resourceName} associated to this service has an invalid format`;
  }

  private getServiceValidation(): ObjectValidation | undefined {
    if (this.state.validations && this.state.validations.service && this.state.serviceDetails) {
      return this.state.validations.service[this.state.serviceDetails.service.name];
    }
    return undefined;
  }

  render() {
    const workloads = this.state.serviceDetails?.workloads || [];
    const validations = this.state.validations || {};
    const validationChecks = this.validationChecks();
    const getSeverityIcon: any = (severity: ValidationTypes = ValidationTypes.Error) => (
      <span className={tabIconStyle}>
        {' '}
        <Validation severity={severity} />
      </span>
    );

    const getValidationIcon = (keys: string[], type: string) => {
      let severity = ValidationTypes.Warning;
      keys.forEach(key => {
        const validationsForIcon = (this.state.validations || {})![type][key];
        if (validationToSeverity(validationsForIcon) === ValidationTypes.Error) {
          severity = ValidationTypes.Error;
        }
      });
      return getSeverityIcon(severity);
    };

    let vsTabTitle, drTabTitle: JSX.Element | undefined;
    if (this.state.serviceDetails) {
      vsTabTitle = (
        <>
          Virtual Services ({this.state.serviceDetails.virtualServices.items.length})
          {validationChecks.hasVirtualServiceChecks
            ? getValidationIcon(
                (this.state.serviceDetails.virtualServices.items || []).map(a => a.metadata.name),
                'virtualservice'
              )
            : undefined}
        </>
      );

      drTabTitle = (
        <>
          Destination Rules ({this.state.serviceDetails.destinationRules.items.length})
          {validationChecks.hasDestinationRuleChecks
            ? getValidationIcon(
                (this.state.serviceDetails.destinationRules.items || []).map(a => a.metadata.name),
                'destinationrule'
              )
            : undefined}
        </>
      );
    }

    return (
      <>
        {this.renderActions()}
        <RenderComponentScroll>
          <Grid style={{ margin: '10px' }} gutter={'md'}>
            <GridItem span={12}>
              <ServiceInfoDescription
                name={this.state.serviceDetails?.service.name || ''}
                namespace={this.props.namespace}
                createdAt={this.state.serviceDetails?.service.createdAt || ''}
                resourceVersion={this.state.serviceDetails?.service.resourceVersion || ''}
                additionalDetails={this.state.serviceDetails?.additionalDetails || []}
                istioEnabled={this.state.serviceDetails?.istioSidecar}
                labels={this.state.serviceDetails?.service.labels}
                selectors={this.state.serviceDetails?.service.selectors}
                ports={this.state.serviceDetails?.service.ports}
                type={this.state.serviceDetails?.service.type}
                ip={this.state.serviceDetails?.service.ip}
                endpoints={this.state.serviceDetails?.endpoints}
                health={this.state.serviceDetails?.health}
                externalName={this.state.serviceDetails?.service.externalName}
                threeScaleServiceRule={this.state.threeScaleServiceRule}
                validations={this.getServiceValidation()}
                miniGraphDatasource={this.graphDataSource}
              />
            </GridItem>
            {this.state.serviceDetails && (
              <GridItem span={12}>
                <ParameterizedTabs
                  id="service-tabs"
                  onSelect={tabValue => {
                    this.setState({ currentTab: tabValue });
                  }}
                  tabMap={paramToTab}
                  tabName={tabName}
                  defaultTab={defaultTab}
                  activeTab={this.state.currentTab}
                >
                  <Tab eventKey={0} title={'Workloads (' + Object.keys(workloads).length + ')'}>
                    <ErrorBoundaryWithMessage message={this.errorBoundaryMessage('Workloads')}>
                      <ServiceInfoWorkload
                        service={this.state.serviceDetails}
                        workloads={workloads}
                        namespace={this.props.namespace}
                      />
                    </ErrorBoundaryWithMessage>
                  </Tab>
                  <Tab eventKey={1} title={vsTabTitle}>
                    <ErrorBoundaryWithMessage message={this.errorBoundaryMessage('Virtual Services')}>
                      <ServiceInfoVirtualServices
                        service={this.state.serviceDetails}
                        virtualServices={this.state.serviceDetails.virtualServices.items}
                        validations={validations!.virtualservice}
                      />
                    </ErrorBoundaryWithMessage>
                  </Tab>
                  <Tab eventKey={2} title={drTabTitle}>
                    <ErrorBoundaryWithMessage message={this.errorBoundaryMessage('Destination Rules')}>
                      <ServiceInfoDestinationRules
                        service={this.state.serviceDetails}
                        destinationRules={this.state.serviceDetails.destinationRules.items}
                        validations={validations!.destinationrule}
                      />
                    </ErrorBoundaryWithMessage>
                  </Tab>
                </ParameterizedTabs>
              </GridItem>
            )}
          </Grid>
        </RenderComponentScroll>
      </>
    );
  }

  private renderActions = (): JSX.Element => {
    const details = this.state.serviceDetails;
    return (
      <RightActionBar>
        <DurationDropdownContainer id="service-info-duration-dropdown" prefix="Last" />
        <RefreshButtonContainer handleRefresh={this.fetchBackend} />
        {details && (
          <IstioWizardDropdown
            namespace={this.props.namespace}
            serviceName={details.service.name}
            show={false}
            workloads={details.workloads || []}
            virtualServices={details.virtualServices}
            destinationRules={details.destinationRules}
            gateways={this.state.gateways}
            tlsStatus={details.namespaceMTLS}
            onChange={this.fetchBackend}
            threeScaleInfo={this.state.threeScaleInfo}
            threeScaleServiceRule={this.state.threeScaleServiceRule}
          />
        )}
      </RightActionBar>
    );
  };
}

export default ServiceInfo;
