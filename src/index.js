/**
 * This class is just a facade for your implementation, the tests below are using the `World` class only.
 * Feel free to add the data and behavior, but don't change the public interface.
 */

export class World {
    constructor() {
        this.countPowerPlant = 0;
        this.countHousehold = 0;
    }

    createPowerPlant() {
        return {
            name: `Power Plant  № ` + ++this.countPowerPlant,
            id: this.countPowerPlant,
            connectingToHouseholds: [],
            isAlive: true,
        };
    }

    createHousehold() {
        return {
            name: `Household  № ` + ++this.countHousehold,
            id: this.countHousehold,
            connectingToOtherHouseholds: [],
            connectingToPowerPlants: [],
            isElectricity: false,
        };
    }

    connectHouseholdToPowerPlant(household, powerPlant) {
        household.connectingToPowerPlants.push(powerPlant);

        const isElectricity =
            this.checkingOtherHouseholdsForElectricity(household) || this.checkingPowerPlantsForElectricity(household);

        if (household.connectingToOtherHouseholds.length) {
            household.connectingToOtherHouseholds = household.connectingToOtherHouseholds.map(h => ({
                ...h,
                isElectricity,
            }));
        }
        powerPlant.connectingToHouseholds.push(household);
    }

    connectHouseholdToHousehold(household1, household2) {
        const isElectricity =
            household1.isElectricity ||
            household2.isElectricity ||
            this.checkingOtherHouseholdsForElectricity(household1) ||
            this.checkingOtherHouseholdsForElectricity(household2) ||
            this.checkingPowerPlantsForElectricity(household1) ||
            this.checkingPowerPlantsForElectricity(household2);

        if (isElectricity) {
            household1.isElectricity = isElectricity;
            household2.isElectricity = isElectricity;
            household1.connectingToOtherHouseholds = household1.connectingToOtherHouseholds.map(h1 => ({
                ...h1,
                isElectricity,
            }));
            household2.connectingToOtherHouseholds = household2.connectingToOtherHouseholds.map(h2 => ({
                ...h2,
                isElectricity,
            }));
        }
        household1.connectingToOtherHouseholds.push(household2);
        household2.connectingToOtherHouseholds.push(household1);
    }

    disconnectHouseholdFromPowerPlant(household, powerPlant) {
        household.connectingToPowerPlants = household.connectingToPowerPlants.filter(p => p.id !== powerPlant.id);

        const isElectricity =
            this.checkingOtherHouseholdsForElectricity(household) || this.checkingPowerPlantsForElectricity(household);

        household.isElectricity = isElectricity;

        if (household.connectingToOtherHouseholds.length) {
            household.connectingToOtherHouseholds = household.connectingToOtherHouseholds.map(h => ({
                ...h,
                isElectricity,
            }));
        }

        powerPlant.connectingToHouseholds = powerPlant.connectingToHouseholds.filter(h => h.id !== household.id);
    }

    killPowerPlant(powerPlant) {
        powerPlant.isAlive = false;
        powerPlant.connectingToHouseholds = this.householdConversionForPowerPlant(powerPlant);
    }

    repairPowerPlant(powerPlant) {
        powerPlant.isAlive = true;
        powerPlant.connectingToHouseholds = this.householdConversionForPowerPlant(powerPlant);
    }

    householdHasEletricity(household) {
        if (household.isElectricity) {
            return household.isElectricity;
        }

        if (household.connectingToPowerPlants.length) {
            return household.connectingToPowerPlants.some(p => p.isAlive);
        }

        if (household.connectingToOtherHouseholds.length) {
            return household.connectingToOtherHouseholds.some(h => h.isElectricity);
        }

        return false;
    }

    checkingOtherHouseholdsForElectricity(household) {
        let isElectricity = false;
        if (household.connectingToOtherHouseholds.length) {
            isElectricity = household.connectingToOtherHouseholds.some(h => h.isElectricity);
        }

        return isElectricity;
    }

    checkingPowerPlantsForElectricity(household) {
        if (!household.connectingToPowerPlants.length) return false;
        return household.connectingToPowerPlants.some(p => p.isAlive);
    }

    householdConversionForPowerPlant(powerPlant) {
        return powerPlant.connectingToHouseholds.map(h => {
            const isElectricity =
                this.checkingOtherHouseholdsForElectricity(h) ||
                this.checkingPowerPlantsForElectricity(h) ||
                powerPlant.isAlive;
            const connectingToOtherHouseholds = h.connectingToOtherHouseholds.map(household => ({
                ...household,
                isElectricity,
            }));
            return {...h, isElectricity, connectingToOtherHouseholds};
        });
    }
}
