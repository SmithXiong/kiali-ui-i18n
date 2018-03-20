export class GraphStyles {
  static options() {
    return { wheelSensitivity: 0.1, autounselectify: false };
  }

  static styles() {
    return [
      {
        selector: 'node',
        css: {
          content: (ele: any) => {
            return ele.data('text') || ele.data('id');
          },
          color: '#030303', // pf-black
          'background-color': '#f9d67a', // pf-gold-200
          'border-width': '1px',
          'border-color': '#030303', // pf-black
          'font-size': '10px',
          'text-valign': 'bottom',
          'text-halign': 'right'
        }
      },
      {
        selector: 'node:selected',
        style: {
          'border-width': '3px',
          'border-color': '#0088ce' // pf-blue
        }
      },
      {
        // version group boxes
        selector: '$node > node',
        css: {
          'padding-top': '10px',
          'padding-left': '20px',
          'padding-bottom': '10px',
          'padding-right': '20px',
          'text-valign': 'top',
          'text-halign': 'center',
          'background-color': '#fbeabc' // pf-gold-100
        }
      },
      {
        selector: 'edge',
        css: {
          width: 3,
          'font-size': '8px',
          'text-margin-x': '25px',
          content: 'data(text)',
          'target-arrow-shape': 'vee',
          'line-color': 'data(color)',
          'target-arrow-color': '#030303', // pf-black
          'curve-style': 'bezier'
        }
      },
      {
        selector: 'edge:selected',
        css: {
          'line-color': '#0088ce', // pf-blue
          'target-arrow-color': '#0088ce', // pf-blue
          'source-arrow-color': '#0088ce' // pf-blue
        }
      },
      // When you mouse over a node, all nodes other than the moused over node
      // and its direct incoming/outgoing edges/nodes are dimmed by these styles.
      {
        selector: 'node.mousedim',
        style: {
          opacity: '0.3'
        }
      },
      {
        selector: 'edge.mousedim',
        style: {
          opacity: '0.3'
        }
      }
    ];
  }
}