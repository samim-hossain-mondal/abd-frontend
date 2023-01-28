import React from 'react';
import { render, cleanup, getByTestId } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import PoNotesContainer from '../components/routes/poNotes';


describe('po-notes',()=>{

    afterEach(cleanup);

    it('renders the po-notes page',()=>{
        const { container } = render(
            <MemoryRouter initialEntries={['/po-notes']}>
                <PoNotesContainer/>
            </MemoryRouter>
        )
        const poNotesIdentifier = getByTestId(container,'poNotesIdentifier');
        expect(poNotesIdentifier).toBeInTheDocument();
    });
});