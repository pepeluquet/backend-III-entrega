import { adoptionsService, petsService, usersService } from "../services/index.js"

const isValidObjectId = (id) => typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id)

const getAllAdoptions = async (req, res) => {
    try {
        const result = await adoptionsService.getAll();
        res.send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message || "Server error" });
    }
}

const getAdoption = async (req, res) => {
    try {
        const adoptionId = req.params.aid;
        if (!isValidObjectId(adoptionId)) {
            return res.status(400).send({ status: "error", error: "Invalid adoption id" })
        }
        const adoption = await adoptionsService.getBy({ _id: adoptionId })
        if (!adoption) return res.status(404).send({ status: "error", error: "Adoption not found" })
        res.send({ status: "success", payload: adoption })
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message || "Server error" });
    }
}

const createAdoption = async (req, res) => {
    try {
        const { uid, pid } = req.params;
        if (!isValidObjectId(uid) || !isValidObjectId(pid)) {
            return res.status(400).send({ status: "error", error: "Invalid user or pet id" })
        }
        const user = await usersService.getUserById(uid);
        if (!user) return res.status(404).send({ status: "error", error: "User not found" });
        const pet = await petsService.getBy({ _id: pid });
        if (!pet) return res.status(404).send({ status: "error", error: "Pet not found" });
        if (pet.adopted) return res.status(400).send({ status: "error", error: "Pet is already adopted" });
        user.pets.push(pet._id);
        await usersService.update(user._id, { pets: user.pets })
        await petsService.update(pet._id, { adopted: true, owner: user._id })
        await adoptionsService.create({ owner: user._id, pet: pet._id })
        res.status(201).send({ status: "success", message: "Pet adopted" })
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message || "Server error" });
    }
}

export default {
    createAdoption,
    getAllAdoptions,
    getAdoption
}